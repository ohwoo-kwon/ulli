import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";

export const profiles = pgTable("profiles", {
  profileId: uuid("profile_id")
    .primaryKey()
    .references(() => authUsers.id, {
      onDelete: "cascade",
    }),
  name: varchar({ length: 30 }).notNull(),
  password: varchar({ length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
