import {
  organizationsTable,
  nodesTable,
  nodesUpdateSchema,
  taskDetailsTable,
  taskDetailsUpdateSchema,
  projectDetailsTable,
  projectDetailsUpdateSchema,
  edgeInsertSchema,
  edgesTable,
  organizationsUpdateSchema,
} from './db/schema.js';
import { eq, inArray } from 'drizzle-orm';
import { db, ee, t, publicProcedure } from './trpc.js';
import z from 'zod';
import { on } from 'node:events';
import { createTaskFrom } from './routers/createTaskFrom.js';
import { createOrganization } from './routers/createOrganization.js';
import { resizeProject } from './routers/resizeProject.js';
import { groupTasks } from './routers/groupTasks.js';
import { archiveCompleted } from './routers/archiveCompleted.js';
import { graph } from './routers/graph.js';
import { dragNodes } from './routers/dragNodes.js';
import { createUser, users } from './routers/users.js';

export const appRouter = t.router({
  users,
  createUser,

  // Only ids the caller already holds: listing them all would leak every link.
  organizations: publicProcedure
    .input(z.object({ ids: z.array(z.uuid()) }))
    .query(({ input: { ids } }) =>
      db
        .select()
        .from(organizationsTable)
        .where(inArray(organizationsTable.id, ids)),
    ),
  createOrganization,
  resizeProject,
  groupTasks,
  archiveCompleted,
  deleteOrganization: publicProcedure
    .input(z.object({ organizationId: z.uuid() }))
    .mutation(async ({ input: { organizationId } }) => {
      await db
        .delete(organizationsTable)
        .where(eq(organizationsTable.id, organizationId));
      ee.emit('update');
      return 'done';
    }),

  updateOrganization: publicProcedure
    .input(
      z.object({
        organizationId: z.uuid(),
        updates: organizationsUpdateSchema,
      }),
    )
    .mutation(async ({ input: { organizationId, updates } }) => {
      await db
        .update(organizationsTable)
        .set(updates)
        .where(eq(organizationsTable.id, organizationId));
      ee.emit('update');
      return 'done';
    }),

  updateProjectDetails: publicProcedure
    .input(z.object({ id: z.uuid(), updates: projectDetailsUpdateSchema }))
    .mutation(async ({ input: { id, updates } }) => {
      await db
        .update(projectDetailsTable)
        .set(updates)
        .where(eq(projectDetailsTable.nodeId, id));
      ee.emit('update');
      return 'done';
    }),

  createEdge: publicProcedure
    .input(edgeInsertSchema)
    .mutation(async ({ input: edge }) => {
      await db.insert(edgesTable).values(edge);
      ee.emit('update');
      return 'done';
    }),

  graph,

  createTaskFrom,

  dragNodes,

  updateNode: publicProcedure
    .input(z.object({ id: z.uuid(), updates: nodesUpdateSchema }))
    .mutation(async ({ input: { id, updates } }) => {
      await db.update(nodesTable).set(updates).where(eq(nodesTable.id, id));
      ee.emit('update');
      return 'done';
    }),

  updateTaskDetails: publicProcedure
    .input(z.object({ nodeId: z.uuid(), updates: taskDetailsUpdateSchema }))
    .mutation(async ({ input: { nodeId, updates } }) => {
      await db
        .update(taskDetailsTable)
        .set(updates)
        .where(eq(taskDetailsTable.nodeId, nodeId));
      ee.emit('update');
      return 'done';
    }),

  deleteNodes: publicProcedure
    .input(z.array(z.uuid()))
    .mutation(async ({ input }) => {
      await db.delete(nodesTable).where(inArray(nodesTable.id, input));
      ee.emit('update');
      return 'done';
    }),

  deleteEdges: publicProcedure
    .input(z.array(z.uuid()))
    .mutation(async ({ input }) => {
      await db.delete(edgesTable).where(inArray(edgesTable.id, input));
      ee.emit('update');
      return 'done';
    }),

  onTasksChange: publicProcedure.subscription(async function* ({ signal }) {
    for await (const updateArgs of on(ee, 'update', { signal })) {
      void updateArgs;
      yield 'update';
    }
  }),
});

export type AppRouter = typeof appRouter;
