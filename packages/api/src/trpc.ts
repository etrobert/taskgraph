import { tasksTable } from './db/schema.js';
import { initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { drizzle } from 'drizzle-orm/node-postgres';
import z from 'zod';

const db = drizzle(process.env.DATABASE_URL!);

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
      await db.insert(tasksTable).values({ name, position: { x: 0, y: 0 } });
      return 'done';
    }),
  health: publicProcedure.query(() => 'ok'),
  tasks: publicProcedure.query(() => db.select().from(tasksTable)),
});
