import {
  bigint,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { profiles } from "../auth/schema";

export const imageTypeEnum = pgEnum("image_type", [
  "USER",
  "PRODUCT",
  "RESULT",
]);

export const images = pgTable("images", {
  imageId: bigint("image_id", { mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  profileId: uuid().references(() => profiles.profileId),
  type: imageTypeEnum().notNull(),
  url: text("url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
