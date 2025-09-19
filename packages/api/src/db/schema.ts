import { pgEnum, pgTable, point, varchar, uuid } from 'drizzle-orm/pg-core';
import { createUpdateSchema } from 'drizzle-zod';

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

export const tasksUpdateSchema = createUpdateSchema(tasksTable);
