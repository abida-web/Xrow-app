import {
  integer,
  numeric,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { store } from "./store-schema";

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("store_id")
    .references(() => store.id, {
      onDelete: "cascade",
    })
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  slug: text("slug").notNull(),
  status: text("status").default("draft"),
  vendor: text("vendor"),
  productType: text("product_type"),
  createAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
export const productImags = pgTable("product_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .references(() => products.id, {
      onDelete: "cascade",
    })
    .notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
export const productVariants = pgTable("product_variants", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .references(() => products.id)
    .notNull(),
  name: text("name").notNull(),
  sku: text("sku"),
  barcode: text("barcode"),
  price: numeric("price").notNull(),
  inventoryQuantity: integer("inventory_quantity"),
  weight: real("weight"),
  imageId: uuid("image_id").references(() => productImags.id),
  createAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
export const productOptions = pgTable("productOptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: text("product_id")
    .references(() => products.id)
    .notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
export const productOptionsValues = pgTable("product_option_value", {
  id: uuid("id").defaultRandom().primaryKey(),
  optionId: uuid("option_id")
    .references(() => productOptions.id)
    .notNull(),
  value: text("value").notNull(),
});
export const variantOptionValues = pgTable(
  "values",
  {
    variantId: uuid("variant_id").references(() => productVariants.id),
    optionValueId: uuid("variant+id"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.variantId, table.optionValueId] }),
  }),
);
export const collections = pgTable("collections", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("store_id").references(() => store.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
export const collectionProducts = pgTable(
  "collections_products",
  {
    collectionId: uuid("collection_id")
      .references(() => collections.id, { onDelete: "cascade" })
      .notNull(),
    productId: uuid("product_id").references(() => products.id),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.collectionId, table.productId],
    }),
  }),
);
export const productTags = pgTable("product_tags", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id, {
    onDelete: "cascade",
  }),
  tag: text("tag").notNull(),
});
export const inventoryTransactions = pgTable("inventory_transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  variantId: uuid("variant_id").references(() => productVariants.id, {
    onDelete: "cascade",
  }),
  quantityChange: integer("quantity_change").notNull(),
  reason: text("reason"),
  createdAt: timestamp("created_at").defaultNow(),
});
