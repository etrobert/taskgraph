import z from 'zod';
import { db, ee, publicProcedure, type TransactionType } from '../trpc.js';
import {
  nodesTable,
  type Point,
  projectDetailsTable,
  type TaskDetails,
  taskDetailsTable,
} from '../db/schema.js';
import { eq, and, getTableColumns } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

const simpleMove = (tx: TransactionType, nodeId: string, position: Point) =>
  tx.update(nodesTable).set({ position }).where(eq(nodesTable.id, nodeId));

// TODO: batch multiple node drag
export const dragNodes = publicProcedure
  .input(
    z.object({
      organizationId: z.string().uuid(),
      nodes: z.array(
        z.object({
          nodeId: z.string().uuid(),
          position: z.object({ x: z.number(), y: z.number() }),
        }),
      ),
    }),
  )
  .mutation(async ({ input: { organizationId, nodes } }) => {
    await db.transaction(async (tx) => {
      for (const { nodeId, position } of nodes) {
        const nodes = await tx
          .select()
          .from(nodesTable)
          .where(eq(nodesTable.id, nodeId));

        const node = nodes.at(0);

        if (node === undefined)
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'There is no such node',
          });

        if (node.type === 'project') await simpleMove(tx, nodeId, position);
        else await handleTaskDrag(tx, organizationId, nodeId, position);
      }
    });

    ee.emit('update');
    return 'done';
  });

async function getAbsolutePosition(
  tx: TransactionType,
  task: TaskDetails,
  position: Point,
) {
  if (task.projectId === null) return position;

  const [project] = await tx
    .select()
    .from(nodesTable)
    .where(eq(nodesTable.id, task.projectId));

  return {
    x: position.x + project.position.x,
    y: position.y + project.position.y,
  };
}

const intersects = (
  point: Point,
  area: { position: Point; width: number; height: number },
) =>
  point.x >= area.position.x &&
  point.x < area.position.x + area.width &&
  point.y >= area.position.y &&
  point.y < area.position.y + area.height;

async function handleTaskDrag(
  tx: TransactionType,
  organizationId: string,
  nodeId: string,
  position: Point,
) {
  const allProjects = await tx
    .select({
      ...getTableColumns(nodesTable),
      ...getTableColumns(projectDetailsTable),
    })
    .from(nodesTable)
    .innerJoin(
      projectDetailsTable,
      eq(nodesTable.id, projectDetailsTable.nodeId),
    )
    .where(
      and(
        eq(nodesTable.organizationId, organizationId),
        eq(nodesTable.type, 'project'),
      ),
    );

  const [task] = await tx
    .select()
    .from(taskDetailsTable)
    .where(eq(taskDetailsTable.nodeId, nodeId));

  const absolutePosition = await getAbsolutePosition(tx, task, position);

  const intersectingProjects = allProjects.filter((project) =>
    intersects(absolutePosition, project),
  );

  if (intersectingProjects.length === 1) {
    const [intersectingProject] = intersectingProjects;
    await tx
      .update(nodesTable)
      .set({
        position: {
          x: absolutePosition.x - intersectingProject.position.x,
          y: absolutePosition.y - intersectingProject.position.y,
        },
      })
      .where(eq(nodesTable.id, nodeId));
    await tx
      .update(taskDetailsTable)
      .set({ projectId: intersectingProject.id })
      .where(eq(taskDetailsTable.nodeId, nodeId));
  } else if (intersectingProjects.length === 0) {
    if (task.projectId === null) {
      await simpleMove(tx, nodeId, position);
    } else {
      await tx
        .update(nodesTable)
        .set({ position: absolutePosition })
        .where(eq(nodesTable.id, nodeId));
      await tx
        .update(taskDetailsTable)
        .set({ projectId: null })
        .where(eq(taskDetailsTable.nodeId, nodeId));
    }
  } else {
    await simpleMove(tx, nodeId, position);
  }
}
