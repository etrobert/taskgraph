import { z } from 'zod';
import { publicProcedure, db, ee } from '../trpc';
import { tasksTable, projectsTable } from '../db/schema';
import { eq, inArray } from 'drizzle-orm';

const padding = 20;

export const groupTasks = publicProcedure
  .input(
    z.object({
      taskIds: z.array(z.string().uuid()),
      organizationId: z.string().uuid(),
    }),
  )
  .mutation(async ({ input }) => {
    const { taskIds, organizationId } = input;

    // First, get the tasks to calculate project bounds
    const tasks = await db
      .select()
      .from(tasksTable)
      .where(inArray(tasksTable.id, taskIds));

    if (tasks.length === 0) {
      throw new Error('No tasks found');
    }

    // Calculate bounding box for the selected tasks
    const minX = Math.min(...tasks.map((task) => task.position.x));
    const maxX = Math.max(...tasks.map((task) => task.position.x));
    const minY = Math.min(...tasks.map((task) => task.position.y));
    const maxY = Math.max(...tasks.map((task) => task.position.y));

    // Add padding around the tasks
    const projectPosition = { x: minX - padding, y: minY - padding };
    const projectWidth = maxX - minX + 150 + 2 * padding; // 150 for task width estimate
    const projectHeight = maxY - minY + 50 + 2 * padding; // 50 for task height estimate

    const [project] = await db
      .insert(projectsTable)
      .values({
        organizationId,
        position: projectPosition,
        width: Math.round(projectWidth),
        height: Math.round(projectHeight),
      })
      .returning();

    // Update each task individually with their relative position
    for (const task of tasks) {
      await db
        .update(tasksTable)
        .set({
          projectId: project.id,
          position: {
            x: task.position.x - projectPosition.x,
            y: task.position.y - projectPosition.y,
          },
        })
        .where(eq(tasksTable.id, task.id));
    }

    ee.emit('update');
    return project;
  });
