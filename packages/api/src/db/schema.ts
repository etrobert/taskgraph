import { pgEnum, pgTable, point, varchar, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';

export const statusEnum = pgEnum('status', [
  'pending',
  'in progress',
  'completed',
]);

export const tasksTable = pgTable('tasks', {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  position: point({ mode: 'xy' }).notNull(),
  status: statusEnum().notNull(),
});

export const dependenciesTable = pgTable('dependencies', {
  id: uuid().primaryKey().defaultRandom(),
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
