import {
  pgEnum,
  pgTable,
  point,
  varchar,
  uuid,
  integer,
  timestamp,
  text,
} from 'drizzle-orm/pg-core';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';

export const statusEnum = pgEnum('status', [
  'pending',
  'in progress',
  'completed',
]);

export const nodeTypeEnum = pgEnum('node_type', ['task', 'project']);

export const visibilityEnum = pgEnum('visibility', ['public', 'private']);

export const organizationsTable = pgTable('organizations', {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull().default('New Organization'),
  ownerId: varchar({ length: 255 }).notNull(),
  visibility: visibilityEnum().notNull().default('public'),
  createdAt: timestamp().notNull().defaultNow(),
});

export const nodesTable = pgTable('nodes', {
  id: uuid().primaryKey().defaultRandom(),
  organizationId: uuid()
    .notNull()
    .references(() => organizationsTable.id, { onDelete: 'cascade' }),
  type: nodeTypeEnum().notNull(),
  name: varchar({ length: 255 }).notNull(),
  position: point({ mode: 'xy' }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  archivedAt: timestamp(),
});

export const edgesTable = pgTable('edges', {
  id: uuid().primaryKey().defaultRandom(),
  organizationId: uuid()
    .notNull()
    .references(() => organizationsTable.id, { onDelete: 'cascade' }),
  source: uuid()
    .notNull()
    .references(() => nodesTable.id, { onDelete: 'cascade' }),
  target: uuid()
    .notNull()
    .references(() => nodesTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp().notNull().defaultNow(),
});

export const taskDetailsTable = pgTable('task_details', {
  nodeId: uuid()
    .primaryKey()
    .references(() => nodesTable.id, { onDelete: 'cascade' }),
  status: statusEnum().notNull(),
  projectId: uuid().references(() => nodesTable.id, { onDelete: 'set null' }),
  description: text(),
});

export const projectDetailsTable = pgTable('project_details', {
  nodeId: uuid()
    .primaryKey()
    .references(() => nodesTable.id, { onDelete: 'cascade' }),
  width: integer().notNull().default(250),
  height: integer().notNull().default(200),
  status: statusEnum().notNull().default('pending'),
});

// New node schemas
export const nodesSelectSchema = createSelectSchema(nodesTable);
export const nodesUpdateSchema = createUpdateSchema(nodesTable);
export const nodesInsertSchema = createInsertSchema(nodesTable);
export const taskDetailsUpdateSchema = createUpdateSchema(taskDetailsTable);
export const taskDetailsInsertSchema = createInsertSchema(taskDetailsTable);
export const projectDetailsUpdateSchema =
  createUpdateSchema(projectDetailsTable);
export const projectDetailsInsertSchema =
  createInsertSchema(projectDetailsTable);
export const edgeInsertSchema = createInsertSchema(edgesTable);
export const organizationsUpdateSchema = createUpdateSchema(organizationsTable);

// New types
export type Node = typeof nodesTable.$inferSelect;
export type TaskDetails = typeof taskDetailsTable.$inferSelect;
export type ProjectDetails = typeof projectDetailsTable.$inferSelect;

export type ExtendedTask = Node & TaskDetails;
export type ExtendedProject = Node & ProjectDetails;

export type Point = { x: number; y: number };
