import {
  tasksTable,
  tasksUpdateSchema,
  dependenciesTable,
  dependenciesInsertSchema,
  tasksInsertSchema,
  organizationsTable,
} from './db/schema.js';
import { initTRPC } from '@trpc/server';
import { eq, inArray } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import EventEmitter, { on } from 'node:events';
import z from 'zod';
import { createTaskFrom } from './routers/createTaskFrom.js';

export const db = drizzle({
  connection: process.env.DATABASE_URL!,
  casing: 'snake_case',
});

export const ee = new EventEmitter();

// created for each request
export const createContext = ({}) => ({}); // no context
type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();
export const publicProcedure = t.procedure;

export const appRouter = t.router({
  organizations: publicProcedure.query(() =>
    db.select().from(organizationsTable),
  ),
  createOrganization: publicProcedure.mutation(() =>
    db.insert(organizationsTable).values({}).returning(),
  ),
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
      const [tasks, dependencies] = await Promise.all([
        db
          .select()
          .from(tasksTable)
          .where(eq(tasksTable.organizationId, organizationId)),
        db
          .select()
          .from(dependenciesTable)
          .where(eq(dependenciesTable.organizationId, organizationId)),
      ]);

      return { tasks, dependencies };
    }),

  createTaskFrom,

  deleteTasks: publicProcedure
    .input(z.array(z.string().uuid()))
    .mutation(async ({ input }) => {
      await db.delete(tasksTable).where(inArray(tasksTable.id, input));
      ee.emit('update');
      return 'done';
    }),

  onTasksChange: publicProcedure.subscription(async function* ({ signal }) {
    for await (const _ of on(ee, 'update', { signal })) yield 'update';
  }),
});
