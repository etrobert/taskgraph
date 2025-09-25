import {
  pgEnum,
  pgTable,
  point,
  varchar,
  uuid,
  integer,
  timestamp,
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

export const organizationsTable = pgTable('organizations', {
  id: uuid().primaryKey().defaultRandom(),
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

export const taskDetailsTable = pgTable('task_details', {
  nodeId: uuid()
    .primaryKey()
    .references(() => nodesTable.id, { onDelete: 'cascade' }),
  status: statusEnum().notNull(),
});

export const tasksTable = pgTable('tasks', {
  id: uuid().primaryKey().defaultRandom(),
  organizationId: uuid()
    .notNull()
    .references(() => organizationsTable.id, { onDelete: 'cascade' }),
  name: varchar({ length: 255 }).notNull(),
  position: point({ mode: 'xy' }).notNull(),
  status: statusEnum().notNull(),
  projectId: uuid().references(() => projectsTable.id),
  createdAt: timestamp().notNull().defaultNow(),
  archivedAt: timestamp(),
});

export const dependenciesTable = pgTable('dependencies', {
  id: uuid().primaryKey().defaultRandom(),
  organizationId: uuid()
    .notNull()
    .references(() => organizationsTable.id, { onDelete: 'cascade' }),
  blockingTaskId: uuid()
    .notNull()
    .references(() => tasksTable.id, { onDelete: 'cascade' }),
  blockedTaskId: uuid()
    .notNull()
    .references(() => tasksTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp().notNull().defaultNow(),
});

export const projectsTable = pgTable('projects', {
  id: uuid().primaryKey().defaultRandom(),
  organizationId: uuid()
    .notNull()
    .references(() => organizationsTable.id, { onDelete: 'cascade' }),
  name: varchar({ length: 255 }).notNull().default('New Project'),
  position: point({ mode: 'xy' }).notNull(),
  width: integer().notNull().default(250),
  height: integer().notNull().default(200),
  status: statusEnum().notNull().default('pending'),
  createdAt: timestamp().notNull().defaultNow(),
  archivedAt: timestamp(),
});

export const tasksSelectSchema = createSelectSchema(tasksTable);
export const tasksUpdateSchema = createUpdateSchema(tasksTable);
export const tasksInsertSchema = createInsertSchema(tasksTable);
export const dependenciesInsertSchema = createInsertSchema(dependenciesTable);
export const projectsSelectSchema = createSelectSchema(projectsTable);
export const projectsUpdateSchema = createUpdateSchema(projectsTable);
export const projectsInsertSchema = createInsertSchema(projectsTable);

export type Task = typeof tasksTable.$inferSelect;
export type Project = typeof projectsTable.$inferSelect;
