import { initTRPC, TRPCError } from '@trpc/server';
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
export const createContext = (opts: CreateExpressContextOptions) => ({
  auth: getAuth(opts.req),
});

export const createWSContext = () => ({ auth: null });

type Context = Awaited<
  ReturnType<typeof createContext> | ReturnType<typeof createWSContext>
>;

export const t = initTRPC.context<Context>().create({ transformer: superjson });
export const publicProcedure = t.procedure;

export const authenticatedProcedure = t.procedure.use(async (opts) => {
  const { ctx } = opts;
  if (ctx.auth === null || !ctx.auth.userId)
    throw new TRPCError({ code: 'UNAUTHORIZED' });

  return opts.next({ ctx: { auth: ctx.auth } });
});

export type DatabaseType = typeof db;
export type TransactionType = Parameters<
  Parameters<DatabaseType['transaction']>[0]
>[0];
