import z from 'zod';
import {
  dependenciesTable,
  tasksInsertSchema,
  tasksTable,
} from '../db/schema.js';
import { db, ee, publicProcedure } from '../trpc.js';

export const createTaskFrom = publicProcedure
  .input(
    tasksInsertSchema.pick({ position: true }).extend({
      organizationId: z.string().uuid(),
      from: z.string().uuid(),
      newTaskType: z.enum(['blocking', 'blocked']),
    }),
  )
  .mutation(
    async ({ input: { from, position, organizationId, newTaskType } }) => {
      const task = await db
        .insert(tasksTable)
        .values({
          name: 'New Task',
          position,
          status: 'pending',
          organizationId,
        })
        .returning();
      await db.insert(dependenciesTable).values(
        newTaskType === 'blocking'
          ? {
              blockedTaskId: from,
              blockingTaskId: task[0].id,
              organizationId,
            }
          : {
              blockedTaskId: task[0].id,
              blockingTaskId: from,
              organizationId,
            },
      );
      ee.emit('update');
      return 'done';
    },
  );
