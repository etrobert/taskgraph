import * as z from 'zod';
import { tasksTable, usersTable } from './db/schema.js';
import { initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { drizzle } from 'drizzle-orm/node-postgres';

const db = drizzle(process.env.DATABASE_URL!);

// created for each request
export const createContext =
  ({}: trpcExpress.CreateExpressContextOptions) => ({}); // no context
type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();
const publicProcedure = t.procedure;

export const appRouter = t.router({
  health: publicProcedure.query(() => 'ok'),
  createUser: publicProcedure
    .input(z.object({ name: z.string(), age: z.number(), email: z.string() }))
    .mutation(({ input: { name, age, email } }) => {
      db.insert(usersTable).values({ name, age, email });
    }),
  users: publicProcedure.query(() => db.select().from(usersTable)),
  tasks: publicProcedure.query(() => db.select().from(tasksTable)),
});
