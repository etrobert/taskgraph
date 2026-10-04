import { z } from 'zod';
import { publicProcedure, db, ee } from '../trpc.js';
import {
  nodesTable,
  projectDetailsTable,
  taskDetailsTable,
} from '../db/schema.js';
import { and, eq, inArray, sql } from 'drizzle-orm';

export const groupTasks = publicProcedure
  .input(
    z.object({
      taskIds: z.array(z.uuid()),
      organizationId: z.uuid(),
      projectBounds: z.object({
        x: z.number(),
        y: z.number(),
        width: z.number(),
        height: z.number(),
      }),
    }),
  )
  .mutation(async ({ input }) => {
    const { taskIds, organizationId, projectBounds } = input;

    const project = await db.transaction(async (tx) => {
      const taskNodes = await tx
        .select({ id: nodesTable.id })
        .from(nodesTable)
        .where(
          and(
            eq(nodesTable.organizationId, organizationId),
            eq(nodesTable.type, 'task'),
            inArray(nodesTable.id, taskIds),
          ),
        );

      if (taskNodes.length !== taskIds.length)
        throw new Error('All tasks were not found');

      const [project] = await tx
        .insert(nodesTable)
        .values({
          organizationId,
          name: 'My Project',
          type: 'project',
          position: { x: projectBounds.x, y: projectBounds.y },
        })
        .returning();

      await tx.insert(projectDetailsTable).values({
        nodeId: project.id,
        width: Math.round(projectBounds.width),
        height: Math.round(projectBounds.height),
      });

      await tx
        .update(nodesTable)
        .set({
          position: sql`point(
            (position[0]::float - ${projectBounds.x}),
            (position[1]::float - ${projectBounds.y})
          )`,
        })
        .where(
          inArray(
            nodesTable.id,
            taskNodes.map(({ id }) => id),
          ),
        );

      await tx
        .update(taskDetailsTable)
        .set({ projectId: project.id })
        .where(inArray(taskDetailsTable.nodeId, taskIds));

      return project;
    });

    ee.emit('update');
    return project;
  });
