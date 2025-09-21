import { projectsTable } from '../db/schema.js';
import { db, ee, publicProcedure } from '../trpc.js';
import z from 'zod';

export const createProject = publicProcedure
  .input(z.object({ organizationId: z.string().uuid() }))
  .mutation(async ({ input: { organizationId } }) => {
    const [project] = await db
      .insert(projectsTable)
      .values({ organizationId })
      .returning();

    ee.emit('update');

    return project;
  });
