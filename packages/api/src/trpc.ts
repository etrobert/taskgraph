import { initTRPC } from '@trpc/server';
import { drizzle } from 'drizzle-orm/node-postgres';
import EventEmitter from 'node:events';
import superjson from 'superjson';
import { requireEnv } from './requireEnv.js';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { getAuth } from '@clerk/express';

export const db = drizzle({
  connection: requireEnv('DATABASE_URL'),
  casing: 'snake_case',
});

export const ee = new EventEmitter();

// created for each request
export const createContext = (opts: CreateExpressContextOptions) => {
  const auth = getAuth(opts.req);

  return {
    userId: auth.userId,
    sessionId: auth.sessionId,
  };
};

export const createWSContext = () => ({});

type Context = Awaited<
  ReturnType<typeof createContext> | ReturnType<typeof createWSContext>
>;

export const t = initTRPC.context<Context>().create({ transformer: superjson });
export const publicProcedure = t.procedure;

export type DatabaseType = typeof db;
export type TransactionType = Parameters<
  Parameters<DatabaseType['transaction']>[0]
>[0];
