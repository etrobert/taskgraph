import {
  nodesTable,
  organizationsTable,
  taskDetailsTable,
} from '../db/schema.js';
import { db, ee, authenticatedProcedure } from '../trpc.js';

export const createOrganization = authenticatedProcedure.mutation(
  async ({ ctx: { auth } }) => {
    const [organization] = await db
      .insert(organizationsTable)
      .values({ name: 'New Organization', ownerId: auth.userId })
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
  },
);
