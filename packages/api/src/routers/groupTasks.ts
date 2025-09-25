import { z } from 'zod';
import { publicProcedure, db, ee } from '../trpc.js';
import {
  nodesTable,
  projectDetailsTable,
  taskDetailsTable,
} from '../db/schema.js';
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
    const taskNodes = await db
      .select()
      .from(nodesTable)
      .where(inArray(nodesTable.id, taskIds));

    if (taskNodes.length === 0) throw new Error('No tasks found');

    const [project] = await db
      .insert(nodesTable)
      .values({
        organizationId,
        name: 'My Project',
        type: 'project',
        position: { x: projectBounds.x, y: projectBounds.y },
      })
      .returning();

    await db.insert(projectDetailsTable).values({
      nodeId: project.id,
      width: Math.round(projectBounds.width),
      height: Math.round(projectBounds.height),
    });

    await db
      .update(nodesTable)
      .set({
        position: sql`point(
          (position[0]::float - ${projectBounds.x}),
          (position[1]::float - ${projectBounds.y})
        )`,
      })
      .where(inArray(nodesTable.id, taskIds));

    await db
      .update(taskDetailsTable)
      .set({ projectId: project.id })
      .where(inArray(taskDetailsTable.nodeId, taskIds));

    ee.emit('update');
    return project;
  });
