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
  organizationsUpdateSchema,
} from './db/schema.js';
import { eq, inArray, or } from 'drizzle-orm';
import {
  db,
  ee,
  t,
  organizationOwnerProcedure,
  publicProcedure,
} from './trpc.js';
import z from 'zod';
import { on } from 'node:events';
import { createTaskFrom } from './routers/createTaskFrom.js';
import { createOrganization } from './routers/createOrganization.js';
import { resizeProject } from './routers/resizeProject.js';
import { groupTasks } from './routers/groupTasks.js';
import { archiveCompleted } from './routers/archiveCompleted.js';
import { graph } from './routers/graph.js';
import { dragNodes } from './routers/dragNodes.js';
import { adminRouter, login, me, signup, users } from './routers/auth.js';

export const appRouter = t.router({
  // TODO: Require min length for password
  signup,
  login,
  me,
  users,

  organizations: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth?.user.id;

    return db
      .select()
      .from(organizationsTable)
      .where(
        or(
          eq(organizationsTable.visibility, 'public'),
          userId ? eq(organizationsTable.ownerId, userId) : undefined,
        ),
      );
  }),
  createOrganization,
  resizeProject,
  groupTasks,
  archiveCompleted,
  deleteOrganization: organizationOwnerProcedure.mutation(
    async ({ input: { organizationId } }) => {
      await db
        .delete(organizationsTable)
        .where(eq(organizationsTable.id, organizationId));
      ee.emit('update');
      return 'done';
    },
  ),

  updateOrganization: organizationOwnerProcedure
    .input(z.object({ updates: organizationsUpdateSchema }))
    .mutation(async ({ input: { updates }, ctx }) => {
      await db
        .update(organizationsTable)
        .set(updates)
        .where(eq(organizationsTable.id, ctx.organization.id));
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

  dragNodes,

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
    for await (const updateArgs of on(ee, 'update', { signal })) {
      void updateArgs;
      yield 'update';
    }
  }),

  ...(process.env.NODE_ENV === 'development' ? { admin: adminRouter } : {}),
});

export type AppRouter = typeof appRouter;
