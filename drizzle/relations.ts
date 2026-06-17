import { relations } from "drizzle-orm";
import {
  catalogProducts,
  catalogs,
  categories,
  collectionProducts,
  collections,
  customerAddresses,
  customers,
  giftCards,
  inventoryLevels,
  locations,
  orders,
  productImages,
  products,
  productTags,
  productVariants,
  store,
  storeSettings,
} from "./schema";

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  store: one(store, {
    fields: [products.storeId],
    references: [store.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  images: many(productImages),
  variants: many(productVariants),
  tags: many(productTags),
  collectionProducts: many(collectionProducts),
  catalogProducts: many(catalogProducts),
}));

export const productImagesRelations = relations(
  productImages,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productImages.productId],
      references: [products.id],
    }),
    variants: many(productVariants),
  }),
);

export const productVariantsRelations = relations(
  productVariants,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
    image: one(productImages, {
      fields: [productVariants.imageId],
      references: [productImages.id],
    }),
    inventoryLevels: many(inventoryLevels),
  }),
);

export const productTagRelations = relations(productTags, ({ one }) => ({
  product: one(products, {
    fields: [productTags.productId],
    references: [products.id],
  }),
}));

export const collectionsRelations = relations(collections, ({ one, many }) => ({
  store: one(store, {
    fields: [collections.storeId],
    references: [store.id],
  }),
  collectionProducts: many(collectionProducts),
}));

export const collectionProductsRelations = relations(
  collectionProducts,
  ({ one }) => ({
    collection: one(collections, {
      fields: [collectionProducts.collectionId],
      references: [collections.id],
    }),
    product: one(products, {
      fields: [collectionProducts.productId],
      references: [products.id],
    }),
  }),
);

export const storeRelations = relations(store, ({ one, many }) => ({
  settings: one(storeSettings, {
    fields: [store.id],
    references: [storeSettings.storeId],
  }),
  products: many(products),
  catalogs: many(catalogs),
  locations: many(locations),
  customers: many(customers),
}));

export const storeSettingsRelations = relations(storeSettings, ({ one }) => ({
  store: one(store, {
    fields: [storeSettings.storeId],
    references: [store.id],
  }),
}));

export const catalogsRelations = relations(catalogs, ({ one, many }) => ({
  store: one(store, {
    fields: [catalogs.storeId],
    references: [store.id],
  }),
  catalogProducts: many(catalogProducts),
}));

export const catalogProductsRelations = relations(
  catalogProducts,
  ({ one }) => ({
    catalog: one(catalogs, {
      fields: [catalogProducts.catalogId],
      references: [catalogs.id],
    }),
    product: one(products, {
      fields: [catalogProducts.productId],
      references: [products.id],
    }),
  }),
);
export const locationsRelations = relations(locations, ({ one, many }) => ({
  store: one(store, {
    fields: [locations.storeId],
    references: [store.id],
  }),
  inventoryLevels: many(inventoryLevels),
}));
export const inventoryLevelsRelations = relations(
  inventoryLevels,
  ({ one, many }) => ({
    variant: one(productVariants, {
      fields: [inventoryLevels.variantId],
      references: [productVariants.id],
    }),
    location: one(locations, {
      fields: [inventoryLevels.locationId],
      references: [locations.id],
    }),
  }),
);
export const customersRelations = relations(customers, ({ one, many }) => ({
  store: one(store, {
    fields: [customers.storeId],
    references: [store.id],
  }),
  orders: many(orders),
  addresses: many(customerAddresses),
  giftCards: many(giftCards),
}));
export const customerAddressesRelations = relations(
  customerAddresses,
  ({ one }) => ({
    customer: one(customers, {
      fields: [customerAddresses.customerId],
      references: [customers.id],
    }),
  }),
);
export const giftCardsRelations = relations(giftCards, ({ one }) => ({
  store: one(store, {
    fields: [giftCards.storeId],
    references: [store.id],
  }),
  customer: one(customers, {
    fields: [giftCards.customerId],
    references: [customers.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
}));
