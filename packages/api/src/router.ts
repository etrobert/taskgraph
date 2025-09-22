import {
  tasksTable,
  tasksUpdateSchema,
  dependenciesTable,
  dependenciesInsertSchema,
  tasksInsertSchema,
  organizationsTable,
  projectsTable,
  projectsUpdateSchema,
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

export const appRouter = t.router({
  organizations: publicProcedure.query(() =>
    db.select().from(organizationsTable),
  ),
  getTask: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input: { id } }) => {
      const [task] = await db
        .select()
        .from(tasksTable)
        .where(eq(tasksTable.id, id));
      return task;
    }),
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
  createTask: publicProcedure
    .input(tasksInsertSchema.pick({ name: true, organizationId: true }))
    .mutation(async ({ input: task }) => {
      await db
        .insert(tasksTable)
        .values({ ...task, position: { x: 0, y: 0 }, status: 'pending' });
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

  graph: publicProcedure
    .input(z.object({ organizationId: z.string().uuid() }))
    .query(async ({ input: { organizationId } }) => {
      const [projects, tasks, dependencies] = await Promise.all([
        db
          .select()
          .from(projectsTable)
          .where(eq(projectsTable.organizationId, organizationId)),
        db
          .select()
          .from(tasksTable)
          .where(eq(tasksTable.organizationId, organizationId)),
        db
          .select()
          .from(dependenciesTable)
          .where(eq(dependenciesTable.organizationId, organizationId)),
      ]);

      return { projects, tasks, dependencies };
    }),

  createTaskFrom,

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
});

export type AppRouter = typeof appRouter;
