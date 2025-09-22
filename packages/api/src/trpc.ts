import { initTRPC } from '@trpc/server';
import { drizzle } from 'drizzle-orm/node-postgres';
import EventEmitter from 'node:events';
import superjson from 'superjson';

export const db = drizzle({
  connection: process.env.DATABASE_URL!,
  casing: 'snake_case',
});

export const ee = new EventEmitter();

// created for each request
export const createContext = ({}) => ({}); // no context
type Context = Awaited<ReturnType<typeof createContext>>;

export const t = initTRPC.context<Context>().create({ transformer: superjson });
export const publicProcedure = t.procedure;
