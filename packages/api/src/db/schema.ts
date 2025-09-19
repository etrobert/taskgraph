import { pgEnum, pgTable, point, varchar, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';

export const statusEnum = pgEnum('status', [
  'pending',
  'in progress',
  'completed',
]);

export const organizationsTable = pgTable('organizations', {
  id: uuid().primaryKey().defaultRandom(),
});

export const tasksTable = pgTable('tasks', {
  id: uuid().primaryKey().defaultRandom(),
  organizationId: uuid()
    .notNull()
    .references(() => organizationsTable.id, { onDelete: 'cascade' }),
  name: varchar({ length: 255 }).notNull(),
  position: point({ mode: 'xy' }).notNull(),
  status: statusEnum().notNull(),
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
});

export const tasksUpdateSchema = createUpdateSchema(tasksTable);
export const tasksInsertSchema = createInsertSchema(tasksTable);
export const dependenciesInsertSchema = createInsertSchema(dependenciesTable);
