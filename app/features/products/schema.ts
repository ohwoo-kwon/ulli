import {
  bigint,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const productCategoryEnum = pgEnum("product_category", [
  "TOP",
  "BOTTOM",
  "OUTER",
  "DRESS",
  "SHOES",
  "BAG",
  "ACCESSORY",
  "INNERWEAR",
  "SPORTSWEAR",
  "SLEEPWEAR",
  "ETC",
]);

export const genderEnum = pgEnum("gender", ["M", "F", "U"]);

export const products = pgTable("products", {
  productId: bigint("product_id", { mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  name: text().notNull(),
  price: integer().notNull().default(0),
  brand: text().notNull(),
  category: productCategoryEnum().notNull(),
  gender: genderEnum(),
  description: text(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
