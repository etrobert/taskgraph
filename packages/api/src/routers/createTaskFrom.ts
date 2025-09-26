import z from 'zod';
import { edgesTable, nodesTable, taskDetailsTable } from '../db/schema.js';
import { db, ee, publicProcedure } from '../trpc.js';

export const createTaskFrom = publicProcedure
  .input(
    z.object({
      position: z.object({ x: z.number(), y: z.number() }),
      organizationId: z.string().uuid(),
      from: z.string().uuid(),
      newTaskType: z.enum(['blocking', 'blocked']),
    }),
  )
  .mutation(
    async ({ input: { from, position, organizationId, newTaskType } }) => {
      await db.transaction(async (tx) => {
        // Create the base node
        const [node] = await tx
          .insert(nodesTable)
          .values({
            name: 'New Task',
            position,
            organizationId,
            type: 'task',
          })
          .returning();

        // Create the task-specific details
        await tx.insert(taskDetailsTable).values({
          nodeId: node.id,
          status: 'pending',
        });

        await tx
          .insert(edgesTable)
          .values(
            newTaskType === 'blocking'
              ? { source: node.id, target: from, organizationId }
              : { source: from, target: node.id, organizationId },
          );
      });

      ee.emit('update');
      return 'done';
    },
  );
