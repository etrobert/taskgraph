import z from 'zod';
import { db, ee, publicProcedure, type TransactionType } from '../trpc.js';
import {
  nodesTable,
  projectDetailsTable,
  taskDetailsTable,
} from '../db/schema.js';
import { eq, and, getTableColumns } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

const simpleMove = (
  tx: TransactionType,
  nodeId: string,
  position: { x: number; y: number },
) => tx.update(nodesTable).set({ position }).where(eq(nodesTable.id, nodeId));

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

async function handleTaskDrag(
  tx: TransactionType,
  organizationId: string,
  nodeId: string,
  position: { x: number; y: number },
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

  const intersectingProjects = allProjects.filter(
    (project) =>
      position.x >= project.position.x &&
      position.x < project.position.x + project.width &&
      position.y >= project.position.y &&
      position.y < project.position.y + project.height,
  );

  if (intersectingProjects.length === 1) {
    const [intersectingProject] = intersectingProjects;
    await tx
      .update(nodesTable)
      .set({
        position: {
          x: position.x - intersectingProject.position.x,
          y: position.y - intersectingProject.position.y,
        },
      })
      .where(eq(nodesTable.id, nodeId));
    await tx
      .update(taskDetailsTable)
      .set({ projectId: intersectingProject.id })
      .where(eq(taskDetailsTable.nodeId, nodeId));
  } else if (intersectingProjects.length === 0) {
    const [task] = await tx
      .select()
      .from(taskDetailsTable)
      .where(eq(taskDetailsTable.nodeId, nodeId));

    if (task.projectId === null) {
      await simpleMove(tx, nodeId, position);
    } else {
      const [oldProject] = await tx
        .select()
        .from(nodesTable)
        .where(eq(nodesTable.id, task.projectId));
      await tx
        .update(nodesTable)
        .set({
          position: {
            x: position.x + oldProject.position.x,
            y: position.y + oldProject.position.y,
          },
        })
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
