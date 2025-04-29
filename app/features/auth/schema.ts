import { pgSchema, timestamp, varchar } from "drizzle-orm/pg-core";

const mySchema = pgSchema("ulli");

export const usersTable = mySchema.table("users", {
  id: varchar({ length: 30 }).primaryKey(),
  name: varchar({ length: 30 }).notNull(),
  password: varchar({ length: 255 }).notNull(),
  created_at: timestamp().defaultNow().notNull(),
});
