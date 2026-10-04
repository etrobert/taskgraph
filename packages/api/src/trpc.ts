import { initTRPC } from '@trpc/server';
import { drizzle } from 'drizzle-orm/node-postgres';
import EventEmitter from 'node:events';
import { requireEnv } from './requireEnv.js';

export const db = drizzle({
  connection: requireEnv('DATABASE_URL'),
  casing: 'snake_case',
});

export const ee = new EventEmitter();

export const t = initTRPC.create();
export const publicProcedure = t.procedure;

export type DatabaseType = typeof db;
export type TransactionType = Parameters<
  Parameters<DatabaseType['transaction']>[0]
>[0];
