import {
  tasksTable,
  tasksUpdateSchema,
  dependenciesTable,
  dependenciesInsertSchema,
  organizationsTable,
  projectsTable,
  projectsUpdateSchema,
  nodesTable,
  nodesUpdateSchema,
  taskDetailsTable,
  taskDetailsUpdateSchema,
} from './db/schema.js';
import { eq, inArray } from 'drizzle-orm';
import { db, ee, t, publicProcedure } from './trpc.js';
import z from 'zod';
import { on } from 'node:events';
import { createTaskFrom } from './routers/createTaskFrom.js';
import { createOrganization } from './routers/createOrganization.js';
import { createProject } from './routers/createProject.js';
import { resizeProject } from './routers/resizeProject.js';
import { groupTasks } from './routers/groupTasks.js';
import { archiveCompleted } from './routers/archiveCompleted.js';
import { graph } from './routers/graph.js';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const appRouter = t.router({
  organizations: publicProcedure.query(() =>
    db.select().from(organizationsTable),
  ),
  createOrganization,
  createProject,
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

  updateProject: publicProcedure
    .input(z.object({ id: z.string().uuid(), updates: projectsUpdateSchema }))
    .mutation(async ({ input: { id, updates } }) => {
      await db
        .update(projectsTable)
        .set(updates)
        .where(eq(projectsTable.id, id));
      ee.emit('update');
      return 'done';
    }),

  createDependency: publicProcedure
    .input(dependenciesInsertSchema)
    .mutation(async ({ input: dependency }) => {
      await db.insert(dependenciesTable).values(dependency);
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
    .input(z.object({ nodeId: z.string().uuid(), updates: taskDetailsUpdateSchema }))
    .mutation(async ({ input: { nodeId, updates } }) => {
      await db.update(taskDetailsTable).set(updates).where(eq(taskDetailsTable.nodeId, nodeId));
      ee.emit('update');
      return 'done';
    }),

  deleteTasks: publicProcedure
    .input(z.array(z.string().uuid()))
    .mutation(async ({ input }) => {
      await db.delete(tasksTable).where(inArray(tasksTable.id, input));
      ee.emit('update');
      return 'done';
    }),

  deleteProjects: publicProcedure
    .input(z.array(z.string().uuid()))
    .mutation(async ({ input }) => {
      await db.delete(projectsTable).where(inArray(projectsTable.id, input));
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

  exportData: publicProcedure.mutation(async () => {
    const [organizations, tasks, projects, dependencies] = await Promise.all([
      db.select().from(organizationsTable),
      db.select().from(tasksTable),
      db.select().from(projectsTable),
      db.select().from(dependenciesTable),
    ]);

    const exportData = {
      organizations,
      tasks,
      projects,
      dependencies,
      exportDate: new Date().toISOString(),
    };

    const exportDir = path.join(process.cwd(), 'data-export');
    await mkdir(exportDir, { recursive: true });

    await writeFile(
      path.join(exportDir, 'taskgraph-export.json'),
      JSON.stringify(exportData, null, 2),
    );

    return `Exported ${organizations.length} organizations, ${tasks.length} tasks, ${projects.length} projects, ${dependencies.length} dependencies to ./data-export/taskgraph-export.json`;
  }),
});

export type AppRouter = typeof appRouter;
