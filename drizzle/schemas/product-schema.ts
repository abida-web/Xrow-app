import {
  boolean,
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
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("store_id")
    .references(() => store.id, {
      onDelete: "cascade",
    })
    .notNull(),
  categoryId: uuid("category_id") // 👈 ADD THIS LINE
    .references(() => categories.id, { onDelete: "set null" }), // 👈 ADD THIS LINE
  name: text("name").notNull(),
  description: text("description"),
  slug: text("slug").notNull(),
  status: text("status").default("draft"),
  vendor: text("vendor"),
  productType: text("product_type"),
  isPublished: boolean("is_published").default(true),
  createAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
export const productImages = pgTable("product_images", {
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
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  sku: text("sku"),
  barcode: text("barcode"),
  price: numeric("price").notNull(),
  inventoryQuantity: integer("inventory_quantity"),
  weight: real("weight"),
  weightUnit: text("weight_unit"),
  imageId: uuid("image_id").references(() => productImages.id),
  createAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
export const productOptions = pgTable("productOptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
export const productOptionsValues = pgTable("product_option_value", {
  id: uuid("id").defaultRandom().primaryKey(),
  optionId: uuid("option_id")
    .references(() => productOptions.id, { onDelete: "cascade" })
    .notNull(),
  value: text("value").notNull(),
});
export const variantOptionValues = pgTable(
  "variant_option_values", // Changed table name from "values" to something more descriptive
  {
    variantId: uuid("variant_id")
      .references(() => productVariants.id, { onDelete: "cascade" })
      .notNull(),
    optionValueId: uuid("option_value_id") // Fixed: changed from "variant_id" to "option_value_id"
      .references(() => productOptionsValues.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.variantId, table.optionValueId] }),
  }),
);
export const collections = pgTable("collections", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("store_id").references(() => store.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").default("manual"),
  publishedScope: text("published_scope"),
  image: text("image"),
  slug: text("slug").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
export const collectionProducts = pgTable(
  "collections_products",
  {
    collectionId: uuid("collection_id")
      .references(() => collections.id, { onDelete: "cascade" })
      .notNull(),
    productId: uuid("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
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
  quantityChange: integer("quantity_change"),

  storeId: uuid("store_id").references(() => store.id, {
    onDelete: "cascade",
  }),
  reason: text("reason"),
  createdAt: timestamp("created_at").defaultNow(),
});
export const salesChannels = pgTable("sales_channels", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("store_id")
    .references(() => store.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(), // 'Online Store', 'Point of Sale', 'Facebook Shop', 'Instagram', 'Google Shopping', 'TikTok Shop', etc.
  handle: text("handle").unique().notNull(), // 'online-store', 'pos', 'facebook', 'instagram', 'google', 'tiktok'
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const productSalesChannels = pgTable(
  "product_sales_channels",
  {
    productId: uuid("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
    channelId: uuid("channel_id")
      .references(() => salesChannels.id, { onDelete: "cascade" })
      .notNull(),
    isPublished: boolean("is_published").default(true),
    publishedAt: timestamp("published_at").defaultNow(),
    unpublishedAt: timestamp("unpublished_at"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.productId, table.channelId] }),
  }),
);

export const catalogs = pgTable("catalogs", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("store_id")
    .references(() => store.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(), // 'Main Catalog', 'B2B Wholesale', 'Winter Collection', etc.
  description: text("description"),
  handle: text("handle").unique().notNull(), // main-catalog, b2b-wholesale, winter-collection
  isActive: boolean("is_active").default(true),
  type: text("type").default("default"), // 'default', 'b2b', 'seasonal'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const catalogProducts = pgTable(
  "catalog_products",
  {
    catalogId: uuid("catalog_id")
      .references(() => catalogs.id, { onDelete: "cascade" })
      .notNull(),
    productId: uuid("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
    isAtCatalog: boolean("is_at_catalog").default(true),
    customPrice: numeric("custom_price"), // Optional: override price for this catalog
    sortOrder: integer("sort_order").default(0),
    addedAt: timestamp("added_at").defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.catalogId, table.productId] }),
  }),
);
