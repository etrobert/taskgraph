import { initTRPC, TRPCError } from '@trpc/server';
import { drizzle } from 'drizzle-orm/node-postgres';
import { and, eq, gt } from 'drizzle-orm';
import EventEmitter from 'node:events';
import superjson from 'superjson';
import { requireEnv } from './requireEnv.js';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import z from 'zod';
import { organizationsTable, sessionsTable } from './db/schema.js';

export const db = drizzle({
  connection: requireEnv('DATABASE_URL'),
  casing: 'snake_case',
});

export const ee = new EventEmitter();

function getCookie(req: CreateExpressContextOptions['req'], name: string) {
  const header = req.headers.cookie;
  if (!header) return null;
  const parts = header.split(';');
  for (const part of parts) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return decodeURIComponent(rest.join('='));
  }
  return null;
}

const getAuth = async (
  req: CreateExpressContextOptions['req'],
): Promise<{ userId: string } | null> => {
  const token = getCookie(req, 'session');
  if (!token) return null;

  const sessionResponse = await db
    .select({ userId: sessionsTable.userId })
    .from(sessionsTable)
    .where(
      and(eq(sessionsTable.id, token), gt(sessionsTable.expiresAt, new Date())),
    );

  const session = sessionResponse.at(0);

  if (!session) return null;
  return { userId: session.userId };
};

// created for each request
export const createContext = async (opts: CreateExpressContextOptions) => ({
  auth: await getAuth(opts.req),
  res: opts.res,
});

export const createWSContext = () => ({ auth: null, res: null });

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

export const organizationOwnerProcedure = authenticatedProcedure
  .input(z.object({ organizationId: z.string().uuid() }))
  .use(async (opts) => {
    const { ctx, input } = opts;

    const [organization] = await db
      .select()
      .from(organizationsTable)
      .where(eq(organizationsTable.id, input.organizationId));

    if (!organization)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Organization not found',
      });

    if (organization.ownerId !== ctx.auth.userId)
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Only the organization owner can perform this action',
      });

    return opts.next({ ctx: { auth: ctx.auth, organization } });
  });

export type DatabaseType = typeof db;
export type TransactionType = Parameters<
  Parameters<DatabaseType['transaction']>[0]
>[0];
