import {
  tasksTable,
  tasksUpdateSchema,
  dependenciesTable,
  dependenciesInsertSchema,
  tasksInsertSchema,
} from './db/schema.js';
import { initTRPC } from '@trpc/server';
import { eq, inArray } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import EventEmitter, { on } from 'node:events';
import z from 'zod';

const db = drizzle({
  connection: process.env.DATABASE_URL!,
  casing: 'snake_case',
});

const ee = new EventEmitter();

// created for each request
export const createContext = ({}) => ({}); // no context
type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();
const publicProcedure = t.procedure;

export const appRouter = t.router({
  createTask: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input: { name } }) => {
      await db
        .insert(tasksTable)
        .values({ name, position: { x: 0, y: 0 }, status: 'pending' });
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

  graph: publicProcedure.query(async () => {
    const [tasks, dependencies] = await Promise.all([
      db.select().from(tasksTable),
      db.select().from(dependenciesTable),
    ]);

    return { tasks, dependencies };
  }),

  createTaskFrom: publicProcedure
    .input(
      tasksInsertSchema.pick({ position: true }).extend({
        from: z.string().uuid(),
        newTaskType: z.enum(['blocking', 'blocked']),
      }),
    )
    .mutation(async ({ input: { from, position, newTaskType } }) => {
      const task = await db
        .insert(tasksTable)
        .values({ name: 'New Task', position, status: 'pending' })
        .returning();
      await db
        .insert(dependenciesTable)
        .values(
          newTaskType === 'blocking'
            ? { blockedTaskId: from, blockingTaskId: task[0].id }
            : { blockedTaskId: task[0].id, blockingTaskId: from },
        );
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

  onTasksChange: publicProcedure.subscription(async function* ({ signal }) {
    for await (const _ of on(ee, 'update', { signal })) yield 'update';
  }),
});
