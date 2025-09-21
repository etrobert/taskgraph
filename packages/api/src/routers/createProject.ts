import { projectsInsertSchema, projectsTable } from '../db/schema.js';
import { db, ee, publicProcedure } from '../trpc.js';

export const createProject = publicProcedure
  .input(projectsInsertSchema)
  .mutation(async ({ input }) => {
    const [project] = await db.insert(projectsTable).values(input).returning();
    ee.emit('update');
    return project;
  });
