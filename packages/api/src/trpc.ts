import { tasksTable, tasksUpdateSchema } from './db/schema.js';
import { initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import EventEmitter, { on } from 'node:events';
import z from 'zod';

const db = drizzle({
  connection: process.env.DATABASE_URL!,
  casing: 'snake_case',
});

const ee = new EventEmitter();

// created for each request
export const createContext =
  ({}: trpcExpress.CreateExpressContextOptions) => ({}); // no context
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
  tasks: publicProcedure.query(() => db.select().from(tasksTable)),

  onTasksChange: publicProcedure.subscription(async function* ({ signal }) {
    for await (const _ of on(ee, 'update', { signal })) yield 'update';
  }),
});
