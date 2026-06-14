import {
  boolean,
  integer,
  numeric,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  unique,
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
    .references(() => store.id, { onDelete: "cascade" })
    .notNull(),
  categoryId: uuid("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  name: text("name").notNull(),
  description: text("description"),
  slug: text("slug").notNull(),
  status: text("status").default("draft"),
  vendor: text("vendor"),
  productType: text("product_type"),
  isPublished: boolean("is_published").default(true),

  // Shopify-style: Store option names at product level
  option1Name: text("option1_name"), // e.g., "Size"
  option2Name: text("option2_name"), // e.g., "Color"
  option3Name: text("option3_name"), // e.g., "Material"

  createAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const productImages = pgTable("product_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const productVariants = pgTable("product_variants", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),

  // Shopify-style: Store option values directly on variant
  option1Value: text("option1_value"), // e.g., "Small"
  option2Value: text("option2_value"), // e.g., "Red"
  option3Value: text("option3_value"), // e.g., "Cotton"
  title: text("title"),
  sku: text("sku"),
  barcode: text("barcode"),
  price: numeric("price").notNull(),
  compareAtPrice: numeric("compare_at_price"), // Shopify field for sale pricing
  inventoryQuantity: integer("inventory_quantity"),
  weight: real("weight"),
  weightUnit: text("weight_unit"),
  imageId: uuid("image_id").references(() => productImages.id),
  locationId: uuid("location_id").references(() => locations.id, {
    onDelete: "set null",
  }),
  createAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Collections remain the same
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
    pk: primaryKey({ columns: [table.collectionId, table.productId] }),
  }),
);

export const productTags = pgTable("product_tags", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id, {
    onDelete: "cascade",
  }),
  tag: text("tag").notNull(),
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
export const locations = pgTable("locations", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("store_id")
    .references(() => store.id, { onDelete: "cascade" })
    .notNull(),

  // Basic Info
  name: text("name").notNull(), // "Main Warehouse", "NYC Store"
  isActive: boolean("is_active").default(true),
  isDefault: boolean("is_default").default(false), // Primary location

  // Address Information
  address1: text("address1"),
  address2: text("address2"),
  city: text("city"),
  province: text("province"),
  provinceCode: text("province_code"),
  country: text("country"),
  countryCode: text("country_code"),
  zip: text("zip"),
  phone: text("phone"),

  // Metadata
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 2. INVENTORY LEVELS (per location per variant)
export const inventoryLevels = pgTable(
  "inventory_levels",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    variantId: uuid("variant_id")
      .references(() => productVariants.id, { onDelete: "cascade" })
      .notNull(),
    locationId: uuid("location_id")
      .references(() => locations.id, { onDelete: "cascade" })
      .notNull(),

    // Quantities
    available: integer("available").default(0), // Sellable stock
    onHand: integer("on_hand").default(0), // Physical stock
    incoming: integer("incoming").default(0), // Expected from POs
    committed: integer("committed").default(0), // Reserved for orders

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    // Each variant can only have one level per location
    uniqueVariantLocation: unique().on(table.variantId, table.locationId),
  }),
);
export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  phone: text("phone"),

  firstName: text("first_name"),
  lastName: text("last_name"),

  status: text("status").notNull().default("enabled"),

  verifiedEmail: boolean("verified_email").notNull().default(false),

  totalSpent: numeric("total_spent").default("0"),
  note: text("note"),
  storeId: uuid("store_id").references(() => store.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Gift Cards Table
export const giftCards = pgTable("gift_cards", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  codeHash: text("code_hash").notNull().unique(),

  initialValue: numeric("initial_value").notNull(),
  balance: numeric("balance"),
  currency: text("currency").notNull().default("USD"),
  storeId: uuid("store_id").references(() => store.id),
  enabled: boolean("enabled").notNull().default(true),

  customerId: uuid("customer_id").references(() => customers.id),
  orderId: uuid("order_id"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresOn: timestamp("expires_on"),

  note: text("note"),
  recipientEmail: text("recipient_email"),
  recipientMessage: text("recipient_message"),
});

// Orders Table
export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderNumber: text("order_number").notNull().unique(),

  customerId: uuid("customer_id").references(() => customers.id),

  totalPrice: numeric("total_price").notNull(),
  currency: text("currency").notNull().default("USD"),

  status: text("status").notNull().default("pending"),

  // Gift card fields
  giftCardId: uuid("gift_card_id").references(() => giftCards.id),
  giftCardApplied: numeric("gift_card_applied"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Gift Card Transactions Table
export const giftCardTransactions = pgTable("gift_card_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  type: text("type").notNull(),
  giftCardId: uuid("gift_card_id")
    .notNull()
    .references(() => giftCards.id),
  orderId: uuid("order_id").references(() => orders.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
