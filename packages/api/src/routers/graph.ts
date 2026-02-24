import z from 'zod';
import {
  nodesTable,
  taskDetailsTable,
  projectDetailsTable,
  edgesTable,
  usersTable,
} from '../db/schema.js';
import { db, publicProcedure } from '../trpc.js';
import { eq, and, getTableColumns } from 'drizzle-orm';

export const graph = publicProcedure
  .input(z.object({ organizationId: z.string().uuid() }))
  .query(async ({ input: { organizationId } }) => {
    try {
      const [tasksRaw, projects, dependencies] = await Promise.all([
        // Get task nodes with their task details and assigned user
        db
          .select({
            ...getTableColumns(nodesTable),
            ...getTableColumns(taskDetailsTable),
            nodeUpdatedAt: nodesTable.updatedAt,
            taskDetailsUpdatedAt: taskDetailsTable.updatedAt,
            // TODO: do not list the columns manually
            assignee: {
              id: usersTable.id,
              name: usersTable.name,
              email: usersTable.email,
              createdAt: usersTable.createdAt,
            },
          })
          .from(nodesTable)
          .innerJoin(
            taskDetailsTable,
            eq(nodesTable.id, taskDetailsTable.nodeId),
          )
          .leftJoin(usersTable, eq(taskDetailsTable.assignedTo, usersTable.id))
          .where(
            and(
              eq(nodesTable.organizationId, organizationId),
              eq(nodesTable.type, 'task'),
            ),
          ),

        // Get project nodes with their project details
        db
          .select({
            ...getTableColumns(nodesTable),
            ...getTableColumns(projectDetailsTable),
          })
          .from(nodesTable)
          .innerJoin(
            projectDetailsTable,
            eq(nodesTable.id, projectDetailsTable.nodeId),
          )
          .where(
            and(
              eq(nodesTable.organizationId, organizationId),
              eq(nodesTable.type, 'project'),
            ),
          ),

        // Dependencies remain unchanged
        db
          .select()
          .from(edgesTable)
          .where(eq(edgesTable.organizationId, organizationId)),
      ]);

      // Aggregate updatedAt to use the most recent between nodes and taskDetails
      const tasks = tasksRaw.map(
        ({ taskDetailsUpdatedAt, nodeUpdatedAt, ...task }) => ({
          ...task,
          updatedAt:
            taskDetailsUpdatedAt > nodeUpdatedAt
              ? taskDetailsUpdatedAt
              : nodeUpdatedAt,
        }),
      );

      return { projects, tasks, dependencies };
    } catch (e) {
      console.error(e);
      throw e;
    }
  });
