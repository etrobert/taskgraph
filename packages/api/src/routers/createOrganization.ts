import { organizationsTable, tasksTable } from '../db/schema.js';
import { db, ee, publicProcedure } from '../trpc.js';

export const createOrganization = publicProcedure.mutation(async () => {
  const [organization] = await db
    .insert(organizationsTable)
    .values({})
    .returning();

  // Create a default task for the new organization
  await db.insert(tasksTable).values({
    organizationId: organization.id,
    name: 'Welcome to TaskGraph!',
    position: { x: 0, y: 0 },
    status: 'pending',
  });

  ee.emit('update');

  return organization;
});
