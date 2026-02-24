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
  usersTable,
  sessionsTable,
} from './db/schema.js';
import { eq, inArray, or } from 'drizzle-orm';
import {
  db,
  ee,
  t,
  publicProcedure,
  organizationOwnerProcedure,
  authenticatedProcedure,
} from './trpc.js';
import { TRPCError } from '@trpc/server';
import z from 'zod';
import { on } from 'node:events';
import { createTaskFrom } from './routers/createTaskFrom.js';
import { createOrganization } from './routers/createOrganization.js';
import { resizeProject } from './routers/resizeProject.js';
import { groupTasks } from './routers/groupTasks.js';
import { archiveCompleted } from './routers/archiveCompleted.js';
import { graph } from './routers/graph.js';
import { dragNodes } from './routers/dragNodes.js';
import argon2 from 'argon2';

export const appRouter = t.router({
  signup: publicProcedure
    .input(
      z.object({ name: z.string(), password: z.string(), email: z.string() }),
    )
    .mutation(async ({ input: { name, password, email } }) => {
      const passwordHash = await argon2.hash(password, {
        type: argon2.argon2id,
      });
      await db.insert(usersTable).values({ email, name, passwordHash });
      // TODO: Check wether it'd be smart to create a session already
      return 'done';
    }),

  login: publicProcedure
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

      res.cookie('session', session.id, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        expires: expiresAt,
      });

      return 'done';
    }),

  me: publicProcedure.query(async ({ ctx: { auth } }) => auth),

  users: authenticatedProcedure.query(() => db.select().from(usersTable)),

  organizations: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth?.userId;

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
});

export type AppRouter = typeof appRouter;
