import { publicProcedure } from '../trpc.js';
import { db, ee } from '../trpc.js';
import { tasksTable } from '../db/schema.js';
import { eq, and, isNull } from 'drizzle-orm';
import z from 'zod';

export const archiveCompletedTasks = publicProcedure
  .input(z.object({ organizationId: z.string().uuid() }))
  .mutation(async ({ input: { organizationId } }) => {
    await db
      .update(tasksTable)
      .set({ archivedAt: new Date() })
      .where(
        and(
          eq(tasksTable.organizationId, organizationId),
          eq(tasksTable.status, 'completed'),
          isNull(tasksTable.archivedAt),
        ),
      );
    ee.emit('update');
    return 'done';
  });
