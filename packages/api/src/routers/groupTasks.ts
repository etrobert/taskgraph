import { z } from 'zod';
import { publicProcedure, db, ee } from '../trpc';
import { tasksTable, projectsTable } from '../db/schema';
import { inArray, sql } from 'drizzle-orm';

export const groupTasks = publicProcedure
  .input(
    z.object({
      taskIds: z.array(z.string().uuid()),
      organizationId: z.string().uuid(),
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

    // Get the tasks to update their positions
    const tasks = await db
      .select()
      .from(tasksTable)
      .where(inArray(tasksTable.id, taskIds));

    if (tasks.length === 0) {
      throw new Error('No tasks found');
    }

    const [project] = await db
      .insert(projectsTable)
      .values({
        organizationId,
        position: { x: projectBounds.x, y: projectBounds.y },
        width: Math.round(projectBounds.width),
        height: Math.round(projectBounds.height),
      })
      .returning();

    await db
      .update(tasksTable)
      .set({
        projectId: project.id,
        position: sql`point(
          (position[0]::float - ${projectBounds.x}),
          (position[1]::float - ${projectBounds.y})
        )`,
      })
      .where(inArray(tasksTable.id, taskIds));

    ee.emit('update');
    return project;
  });
