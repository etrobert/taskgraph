import { z } from 'zod';
import { publicProcedure, db, ee } from '../trpc';
import { tasksTable, projectsTable } from '../db/schema';
import { eq, inArray } from 'drizzle-orm';

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

    // Update each task individually with their relative position
    for (const task of tasks) {
      await db
        .update(tasksTable)
        .set({
          projectId: project.id,
          position: {
            x: task.position.x - projectBounds.x,
            y: task.position.y - projectBounds.y,
          },
        })
        .where(eq(tasksTable.id, task.id));
    }

    ee.emit('update');
    return project;
  });
