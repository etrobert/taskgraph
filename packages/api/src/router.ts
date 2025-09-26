import {
  tasksTable,
  tasksUpdateSchema,
  dependenciesTable,
  dependenciesInsertSchema,
  organizationsTable,
  nodesTable,
  nodesUpdateSchema,
  taskDetailsTable,
  taskDetailsUpdateSchema,
  projectDetailsTable,
  projectDetailsUpdateSchema,
  edgeInsertSchema,
  edgesTable,
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
import { migrate } from './routers/migration.js';

export const appRouter = t.router({
  organizations: publicProcedure.query(() =>
    db.select().from(organizationsTable),
  ),
  createOrganization,
  resizeProject,
  groupTasks,
  archiveCompleted,
  deleteOrganization: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input: { id } }) => {
      await db.delete(organizationsTable).where(eq(organizationsTable.id, id));
      ee.emit('update');
      return 'done';
    }),
  updateTask: publicProcedure
    .input(z.object({ id: z.string().uuid(), updates: tasksUpdateSchema }))
    .mutation(async ({ input: { id, updates } }) => {
      await db.update(tasksTable).set(updates).where(eq(tasksTable.id, id));
      ee.emit('update');
      return 'done';
    }),

  updateProjectDetails: publicProcedure
    .input(
      z.object({ id: z.string().uuid(), updates: projectDetailsUpdateSchema }),
    )
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

  updateNode: publicProcedure
    .input(z.object({ id: z.string().uuid(), updates: nodesUpdateSchema }))
    .mutation(async ({ input: { id, updates } }) => {
      await db.update(nodesTable).set(updates).where(eq(nodesTable.id, id));
      ee.emit('update');
      return 'done';
    }),

  updateTaskDetails: publicProcedure
    .input(
      z.object({ nodeId: z.string().uuid(), updates: taskDetailsUpdateSchema }),
    )
    .mutation(async ({ input: { nodeId, updates } }) => {
      await db
        .update(taskDetailsTable)
        .set(updates)
        .where(eq(taskDetailsTable.nodeId, nodeId));
      ee.emit('update');
      return 'done';
    }),

  deleteNodes: publicProcedure
    .input(z.array(z.string().uuid()))
    .mutation(async ({ input }) => {
      await db.delete(nodesTable).where(inArray(nodesTable.id, input));
      ee.emit('update');
      return 'done';
    }),

  deleteDependencies: publicProcedure
    .input(z.array(z.string().uuid()))
    .mutation(async ({ input }) => {
      await db
        .delete(dependenciesTable)
        .where(inArray(dependenciesTable.id, input));
      ee.emit('update');
      return 'done';
    }),

  onTasksChange: publicProcedure.subscription(async function* ({ signal }) {
    for await (const _ of on(ee, 'update', { signal })) yield 'update';
  }),

  migrate,
});

export type AppRouter = typeof appRouter;
