import { TRPCError } from '@trpc/server';
import argon2 from 'argon2';
import { eq } from 'drizzle-orm';
import z from 'zod';
import { sessionsTable, usersTable } from '../db/schema.js';
import { authenticatedProcedure, db, publicProcedure, t } from '../trpc.js';

const hashPassword = (password: string) =>
  argon2.hash(password, {
    type: argon2.argon2id,
  });

export const signup = publicProcedure
  .input(
    z.object({ name: z.string(), password: z.string(), email: z.string() }),
  )
  .mutation(async ({ input: { name, password, email } }) => {
    const passwordHash = await hashPassword(password);
    await db.insert(usersTable).values({ email, name, passwordHash });
    // TODO: Check wether it'd be smart to create a session already
    return 'done';
  });

export const login = publicProcedure
  .input(z.object({ email: z.string(), password: z.string() }))
  .mutation(async ({ input: { email, password }, ctx: { res } }) => {
    if (res === null) throw new Error('unexpected null res');

    const userResponse = await db
      .select({
        id: usersTable.id,
        passwordHash: usersTable.passwordHash,
      })
      .from(usersTable)
      .where(eq(usersTable.email, email));

    const user = userResponse.at(0);

    if (!user || !user.passwordHash)
      throw new TRPCError({ code: 'UNAUTHORIZED' });

    const ok = await argon2.verify(user.passwordHash, password);
    if (!ok) throw new TRPCError({ code: 'UNAUTHORIZED' });

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    const [session] = await db
      .insert(sessionsTable)
      .values({ userId: user.id, expiresAt })
      .returning({ id: sessionsTable.id });

    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('session', session.id, {
      httpOnly: true,
      sameSite: isProd ? 'none' : 'lax',
      secure: isProd,
      expires: expiresAt,
    });

    return 'done';
  });

export const me = publicProcedure.query(async ({ ctx: { auth } }) => auth);

export const users = authenticatedProcedure.query(() =>
  db.select().from(usersTable),
);

export const adminRouter = t.router({
  // TODO: Error when there are no matching users
  assignPassword: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async ({ input: { email, password } }) => {
      await db
        .update(usersTable)
        .set({ passwordHash: await hashPassword(password) })
        .where(eq(usersTable.email, email));

      return 'done';
    }),
});
