import { eq } from 'drizzle-orm';
import z from 'zod';
import { usersTable } from '../db/schema.js';
import { db, ee, publicProcedure } from '../trpc.js';

export const users = publicProcedure
  .input(z.object({ organizationId: z.string().uuid() }))
  .query(({ input: { organizationId } }) =>
    db
      .select()
      .from(usersTable)
      .where(eq(usersTable.organizationId, organizationId))
      .orderBy(usersTable.createdAt),
  );

export const createUser = publicProcedure
  .input(
    z.object({
      organizationId: z.string().uuid(),
      name: z.string().trim().min(1),
    }),
  )
  .mutation(async ({ input }) => {
    const [user] = await db.insert(usersTable).values(input).returning();
    ee.emit('update');
    return user;
  });
