import {
  dependenciesTable,
  edgesTable,
  nodesTable,
  projectDetailsTable,
  projectsTable,
  taskDetailsTable,
  tasksTable,
} from '../db/schema.js';
import { publicProcedure, db } from '../trpc.js';

export const migrate = publicProcedure.mutation(async () => {
  await db.transaction(async (tx) => {
    const [tasks, projects, dependencies] = await Promise.all([
      tx.select().from(tasksTable),
      tx.select().from(projectsTable),
      tx.select().from(dependenciesTable),
    ]);

    const taskMigrations = tasks.map(
      async ({
        id,
        organizationId,
        name,
        position,
        createdAt,
        archivedAt,
        status,
        projectId,
      }) => {
        await tx.insert(nodesTable).values({
          id,
          organizationId,
          type: 'task',
          name,
          position,
          createdAt,
          archivedAt,
        });

        await tx.insert(taskDetailsTable).values({
          nodeId: id,
          status,
          projectId,
        });
      },
    );

    const projectMigrations = projects.map(
      async ({
        id,
        organizationId,
        name,
        position,
        createdAt,
        archivedAt,
        width,
        height,
        status,
      }) => {
        await tx.insert(nodesTable).values({
          id,
          organizationId,
          type: 'project',
          name,
          position,
          createdAt,
          archivedAt,
        });
        await tx.insert(projectDetailsTable).values({
          nodeId: id,
          width,
          height,
          status,
        });
      },
    );

    const dependencyMigrations = dependencies.map(
      ({ id, blockingTaskId, organizationId, blockedTaskId, createdAt }) =>
        tx.insert(edgesTable).values({
          id,
          organizationId,
          source: blockingTaskId,
          target: blockedTaskId,
          createdAt,
        }),
    );

    await Promise.all([
      ...taskMigrations,
      ...projectMigrations,
      ...dependencyMigrations,
    ]);

    return 'done';
  });
});
