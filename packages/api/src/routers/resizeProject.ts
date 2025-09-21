import { projectsTable, tasksTable } from '../db/schema.js';
import { db, ee, publicProcedure } from '../trpc.js';
import { eq, sql } from 'drizzle-orm';
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
  .mutation(
    async ({ input: { id, position: newPosition, width, height } }) => {
      // Get the current project position from database
      const [currentProject] = await db
        .select()
        .from(projectsTable)
        .where(eq(projectsTable.id, id));

      if (!currentProject) throw new Error('Project not found');

      // Calculate position delta (how much the project moved)
      const deltaX = newPosition.x - currentProject.position.x;
      const deltaY = newPosition.y - currentProject.position.y;

      // Update the project
      await db
        .update(projectsTable)
        .set({
          position: newPosition,
          width,
          height,
        })
        .where(eq(projectsTable.id, id));

      // If position changed (resize to left/top), adjust child task positions
      if (deltaX !== 0 || deltaY !== 0) {
        await db
          .update(tasksTable)
          .set({
            position: sql`point(
              (position[0]::float - ${deltaX}),
              (position[1]::float - ${deltaY})
            )`,
          })
          .where(eq(tasksTable.projectId, id));
      }

      ee.emit('update');
      return 'done';
    },
  );