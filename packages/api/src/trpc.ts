import { initTRPC } from '@trpc/server';
import { drizzle } from 'drizzle-orm/node-postgres';
import EventEmitter from 'node:events';
import superjson from 'superjson';
import { requireEnv } from './requireEnv.js';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { getAuth } from '@clerk/express';
import type { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws';

export const db = drizzle({
  connection: requireEnv('DATABASE_URL'),
  casing: 'snake_case',
});

export const ee = new EventEmitter();

function isExpress(
  opts: CreateExpressContextOptions | CreateWSSContextFnOptions,
): opts is CreateExpressContextOptions {
  return 'res' in opts; // only Express has `res`
}

// created for each request
export const createContext = (
  opts: CreateExpressContextOptions | CreateWSSContextFnOptions,
) => {
  if (isExpress(opts)) {
    const auth = getAuth(opts.req);

    return {
      userId: auth.userId,
      sessionId: auth.sessionId,
    };
  }
  return {};
};

type Context = Awaited<ReturnType<typeof createContext>>;

export const t = initTRPC.context<Context>().create({ transformer: superjson });
export const publicProcedure = t.procedure;

export type DatabaseType = typeof db;
export type TransactionType = Parameters<
  Parameters<DatabaseType['transaction']>[0]
>[0];
