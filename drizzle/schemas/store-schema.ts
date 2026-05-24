import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const store = pgTable("store", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(), // Added notNull()
  slug: text("slug").unique().notNull(), // Added notNull()
  ownerId: text("owner_id")
    .references(() => user.id)
    .notNull(),
  shopDomain: text("shop_domain"), // Fixed typo
  logoUrl: text("logo_url"),
  businessType: text("business_type"), // Fixed typo
  currency: text("currency").default("AFG"),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const storeMembers = pgTable("store_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("store_id")
    .references(() => store.id, { onDelete: "cascade" })
    .notNull(),
  userId: text("user_id")
    .references(() => user.id)
    .notNull(),
  role: text("role").notNull(), // Added notNull()
  createdAt: timestamp("created_at").defaultNow(),
});
