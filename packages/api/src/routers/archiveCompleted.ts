import { publicProcedure } from '../trpc.js';
import { db, ee } from '../trpc.js';
import { tasksTable, projectsTable } from '../db/schema.js';
import { eq, and, isNull } from 'drizzle-orm';
import z from 'zod';

export const archiveCompleted = publicProcedure
  .input(z.object({ organizationId: z.string().uuid() }))
  .mutation(async ({ input: { organizationId } }) => {
    const now = new Date();

    // Archive completed tasks
    await db
      .update(tasksTable)
      .set({ archivedAt: now })
      .where(
        and(
          eq(tasksTable.organizationId, organizationId),
          eq(tasksTable.status, 'completed'),
          isNull(tasksTable.archivedAt),
        ),
      );

    // Archive completed projects
    await db
      .update(projectsTable)
      .set({ archivedAt: now })
      .where(
        and(
          eq(projectsTable.organizationId, organizationId),
          eq(projectsTable.status, 'completed'),
          isNull(projectsTable.archivedAt),
        ),
      );

    ee.emit('update');
    return 'done';
  });
