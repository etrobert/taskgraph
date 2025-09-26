import { initTRPC } from '@trpc/server';
import { drizzle } from 'drizzle-orm/node-postgres';
import EventEmitter from 'node:events';
import superjson from 'superjson';
import { requireEnv } from './requireEnv.js';

export const db = drizzle({
  connection: requireEnv('DATABASE_URL'),
  casing: 'snake_case',
});

export const ee = new EventEmitter();

// created for each request
export const createContext = ({}) => ({}); // no context
type Context = Awaited<ReturnType<typeof createContext>>;

export const t = initTRPC.context<Context>().create({ transformer: superjson });
export const publicProcedure = t.procedure;

export type DatabaseType = typeof db;
export type TransactionType = Parameters<
  Parameters<DatabaseType['transaction']>[0]
>[0];
