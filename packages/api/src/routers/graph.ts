import z from 'zod';
import {
  nodesTable,
  taskDetailsTable,
  projectDetailsTable,
  edgesTable,
} from '../db/schema.js';
import { db, publicProcedure } from '../trpc.js';
import { eq, and, getTableColumns } from 'drizzle-orm';

export const graph = publicProcedure
  .input(z.object({ organizationId: z.string().uuid() }))
  .query(async ({ input: { organizationId } }) => {
    const [tasks, projects, dependencies] = await Promise.all([
      // Get task nodes with their task details
      db
        .select({
          ...getTableColumns(nodesTable),
          ...getTableColumns(taskDetailsTable),
        })
        .from(nodesTable)
        .innerJoin(taskDetailsTable, eq(nodesTable.id, taskDetailsTable.nodeId))
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
        .where(eq(nodesTable.organizationId, organizationId)),
    ]);

    return { projects, tasks, dependencies };
  });

