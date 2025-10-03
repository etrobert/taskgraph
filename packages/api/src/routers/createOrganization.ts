import {
  nodesTable,
  organizationsTable,
  taskDetailsTable,
} from '../db/schema.js';
import { db, ee, publicProcedure } from '../trpc.js';

export const createOrganization = publicProcedure.mutation(async () => {
  const [organization] = await db
    .insert(organizationsTable)
    .values({ name: 'New Organization' })
    .returning();

  // Create a default task for the new organization
  const [node] = await db
    .insert(nodesTable)
    .values({
      type: 'task',
      organizationId: organization.id,
      name: 'Welcome to TaskGraph!',
      position: { x: 0, y: 0 },
    })
    .returning();

  await db.insert(taskDetailsTable).values({
    nodeId: node.id,
    status: 'pending',
  });

  ee.emit('update');

  return organization;
});
