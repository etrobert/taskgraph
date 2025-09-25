import {
  nodesTable,
  projectDetailsTable,
  taskDetailsTable,
} from '../db/schema.js';
import { db, ee, publicProcedure } from '../trpc.js';
import { and, eq, sql, inArray } from 'drizzle-orm';
import z from 'zod';

export const resizeProject = publicProcedure
  .input(
    z.object({
      id: z.string().uuid(),
      position: z.object({ x: z.number(), y: z.number() }),
      width: z.number(),
      height: z.number(),
    }),
  )
  .mutation(async ({ input: { id, position: newPosition, width, height } }) => {
    await db.transaction(async (tx) => {
      // Get the current project position from database
      const [currentProject] = await tx
        .select()
        .from(nodesTable)
        .where(and(eq(nodesTable.id, id), eq(nodesTable.type, 'project')));

      if (!currentProject) throw new Error('Project not found');

      // Calculate position delta (how much the project moved)
      const deltaX = newPosition.x - currentProject.position.x;
      const deltaY = newPosition.y - currentProject.position.y;

      // Update the project
      await tx
        .update(nodesTable)
        .set({ position: newPosition })
        .where(eq(nodesTable.id, id));

      await tx
        .update(projectDetailsTable)
        .set({ width, height })
        .where(eq(projectDetailsTable.nodeId, id));

      // If position changed (resize to left/top), adjust child task positions
      if (deltaX !== 0 || deltaY !== 0) {
        await tx
          .update(nodesTable)
          .set({
            position: sql`point(
              (position[0]::float - ${deltaX}),
              (position[1]::float - ${deltaY})
            )`,
          })
          .where(
            inArray(
              nodesTable.id,
              tx
                .select({ nodeId: taskDetailsTable.nodeId })
                .from(taskDetailsTable)
                .where(eq(taskDetailsTable.projectId, id)),
            ),
          );
      }
    });

    ee.emit('update');
    return 'done';
  });
