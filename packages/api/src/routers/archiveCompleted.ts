import { db, ee, publicProcedure } from '../trpc.js';
import {
  nodesTable,
  taskDetailsTable,
  projectDetailsTable,
} from '../db/schema.js';
import { eq, and, isNull, inArray } from 'drizzle-orm';
import z from 'zod';

export const archiveCompleted = publicProcedure
  .input(z.object({ organizationId: z.uuid() }))
  .mutation(async ({ input: { organizationId } }) => {
    const now = new Date();

    await db.transaction(async (tx) => {
      const completedTaskNodes = tx
        .select({ nodeId: taskDetailsTable.nodeId })
        .from(taskDetailsTable)
        .where(eq(taskDetailsTable.status, 'completed'));

      await tx
        .update(nodesTable)
        .set({ archivedAt: now })
        .where(
          and(
            eq(nodesTable.organizationId, organizationId),
            eq(nodesTable.type, 'task'),
            isNull(nodesTable.archivedAt),
            inArray(nodesTable.id, completedTaskNodes),
          ),
        );

      const completedProjectNodes = tx
        .select({ nodeId: projectDetailsTable.nodeId })
        .from(projectDetailsTable)
        .where(eq(projectDetailsTable.status, 'completed'));

      await tx
        .update(nodesTable)
        .set({ archivedAt: now })
        .where(
          and(
            eq(nodesTable.organizationId, organizationId),
            eq(nodesTable.type, 'project'),
            isNull(nodesTable.archivedAt),
            inArray(nodesTable.id, completedProjectNodes),
          ),
        );
    });

    ee.emit('update');
    return 'done';
  });
