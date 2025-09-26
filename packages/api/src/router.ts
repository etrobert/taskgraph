import {
  organizationsTable,
  nodesTable,
  nodesUpdateSchema,
  taskDetailsTable,
  taskDetailsUpdateSchema,
  projectDetailsTable,
  projectDetailsUpdateSchema,
  edgeInsertSchema,
  edgesTable,
} from './db/schema.js';
import { eq, inArray, sql } from 'drizzle-orm';
import { db, ee, t, publicProcedure } from './trpc.js';
import z from 'zod';
import { on } from 'node:events';
import { createTaskFrom } from './routers/createTaskFrom.js';
import { createOrganization } from './routers/createOrganization.js';
import { resizeProject } from './routers/resizeProject.js';
import { groupTasks } from './routers/groupTasks.js';
import { archiveCompleted } from './routers/archiveCompleted.js';
import { graph } from './routers/graph.js';
import { dragNode } from './routers/dragNode.js';

export const appRouter = t.router({
  organizations: publicProcedure.query(() =>
    db.select().from(organizationsTable),
  ),
  createOrganization,
  resizeProject,
  groupTasks,
  archiveCompleted,
  deleteOrganization: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input: { id } }) => {
      await db.delete(organizationsTable).where(eq(organizationsTable.id, id));
      ee.emit('update');
      return 'done';
    }),

  updateProjectDetails: publicProcedure
    .input(
      z.object({ id: z.string().uuid(), updates: projectDetailsUpdateSchema }),
    )
    .mutation(async ({ input: { id, updates } }) => {
      await db
        .update(projectDetailsTable)
        .set(updates)
        .where(eq(projectDetailsTable.nodeId, id));
      ee.emit('update');
      return 'done';
    }),

  createEdge: publicProcedure
    .input(edgeInsertSchema)
    .mutation(async ({ input: edge }) => {
      await db.insert(edgesTable).values(edge);
      ee.emit('update');
      return 'done';
    }),

  graph,

  createTaskFrom,

  dragNode,

  removeTaskFromProject: publicProcedure
    .input(z.object({ taskId: z.string().uuid() }))
    .mutation(async ({ input: { taskId } }) => {
      await db.transaction(async (tx) => {
        const tasks = await tx
          .select()
          .from(taskDetailsTable)
          .where(eq(taskDetailsTable.nodeId, taskId));

        if (tasks.length === 0) throw new Error('Could not find task');

        const [task] = tasks;

        if (task.projectId === null)
          throw new Error('Task is not in a project');

        const projects = await tx
          .select()
          .from(nodesTable)
          .where(eq(nodesTable.id, task.projectId));

        if (projects.length === 0) throw new Error('Could not find project');

        const [project] = projects;

        await tx
          .update(nodesTable)
          .set({
            position: sql`point(
              (position[0]::float + ${project.position.x}),
              (position[1]::float + ${project.position.y})
            )`,
          })
          .where(eq(nodesTable.id, taskId));

        await tx
          .update(taskDetailsTable)
          .set({ projectId: null })
          .where(eq(taskDetailsTable.nodeId, taskId));
      });
      ee.emit('update');
      return 'done';
    }),

  addTaskToProject: publicProcedure
    .input(
      z.object({ taskId: z.string().uuid(), projectId: z.string().uuid() }),
    )
    .mutation(async ({ input: { taskId, projectId } }) => {
      await db.transaction(async (tx) => {
        const projects = await tx
          .select()
          .from(nodesTable)
          .where(eq(nodesTable.id, projectId));

        if (projects.length === 0) throw new Error('Could not find project');

        const [project] = projects;

        await tx
          .update(nodesTable)
          .set({
            position: sql`point(
              (position[0]::float - ${project.position.x}),
              (position[1]::float - ${project.position.y})
            )`,
          })
          .where(eq(nodesTable.id, taskId));

        await tx
          .update(taskDetailsTable)
          .set({ projectId })
          .where(eq(taskDetailsTable.nodeId, taskId));
      });
      ee.emit('update');
      return 'done';
    }),

  updateNode: publicProcedure
    .input(z.object({ id: z.string().uuid(), updates: nodesUpdateSchema }))
    .mutation(async ({ input: { id, updates } }) => {
      await db.update(nodesTable).set(updates).where(eq(nodesTable.id, id));
      ee.emit('update');
      return 'done';
    }),

  updateTaskDetails: publicProcedure
    .input(
      z.object({ nodeId: z.string().uuid(), updates: taskDetailsUpdateSchema }),
    )
    .mutation(async ({ input: { nodeId, updates } }) => {
      await db
        .update(taskDetailsTable)
        .set(updates)
        .where(eq(taskDetailsTable.nodeId, nodeId));
      ee.emit('update');
      return 'done';
    }),

  deleteNodes: publicProcedure
    .input(z.array(z.string().uuid()))
    .mutation(async ({ input }) => {
      await db.delete(nodesTable).where(inArray(nodesTable.id, input));
      ee.emit('update');
      return 'done';
    }),

  deleteEdges: publicProcedure
    .input(z.array(z.string().uuid()))
    .mutation(async ({ input }) => {
      await db.delete(edgesTable).where(inArray(edgesTable.id, input));
      ee.emit('update');
      return 'done';
    }),

  onTasksChange: publicProcedure.subscription(async function* ({ signal }) {
    for await (const _ of on(ee, 'update', { signal })) yield 'update';
  }),
});

export type AppRouter = typeof appRouter;
