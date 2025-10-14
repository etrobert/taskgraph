import z from 'zod';
import { edgesTable, nodesTable, taskDetailsTable } from '../db/schema.js';
import { db, ee, publicProcedure } from '../trpc.js';
import { eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

export const createTaskFrom = publicProcedure
  .input(
    z.object({
      position: z.object({ x: z.number(), y: z.number() }),
      organizationId: z.string().uuid(),
      from: z.string().uuid(),
      newTaskType: z.enum(['blocking', 'blocked']),
      projectId: z.string().uuid().optional(),
    }),
  )
  .mutation(
    async ({
      input: { from, position, organizationId, newTaskType, projectId },
    }) => {
      await db.transaction(async (tx) => {
        // TODO: Extract in helper
        async function getPosition() {
          if (projectId === undefined) return position;
          const projectResult = await tx
            .select()
            .from(nodesTable)
            .where(eq(nodesTable.id, projectId));
          const project = projectResult.at(0);
          if (project === undefined)
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Could not find parent project',
            });

          return {
            x: position.x - project.position.x,
            y: position.y - project.position.y,
          };
        }

        const newPosition = await getPosition();

        // Create the base node
        const [node] = await tx
          .insert(nodesTable)
          .values({
            name: 'New Task',
            position: newPosition,
            organizationId,
            type: 'task',
          })
          .returning();

        // Create the task-specific details
        await tx.insert(taskDetailsTable).values({
          nodeId: node.id,
          status: 'pending',
          projectId,
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
