import { relations } from "drizzle-orm";
import {
  catalogProducts,
  catalogs,
  categories,
  collectionProducts,
  collections,
  inventoryTransactions,
  productImages,
  productOptions,
  productOptionsValues,
  products,
  productTags,
  productVariants,
  store,
  storeSettings,
  variantOptionValues,
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
  options: many(productOptions),
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
    varients: many(productVariants),
  }),
);
export const productVarientsRelations = relations(
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
    optionValues: many(variantOptionValues),
    inventoryTransactions: many(inventoryTransactions),
  }),
);
export const productOptionsRelations = relations(
  productOptions,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productOptions.productId],
      references: [products.id],
    }),
    values: many(productOptionsValues),
  }),
);
export const productOptionValuesRelations = relations(
  productOptionsValues,
  ({ one, many }) => ({
    option: one(productOptions, {
      fields: [productOptionsValues.optionId],
      references: [productOptions.id],
    }),
    variants: many(productVariants),
  }),
);
export const variantOptionValuesRelations = relations(
  variantOptionValues,
  ({ one }) => ({
    varient: one(productVariants, {
      fields: [variantOptionValues.variantId],
      references: [productVariants.id],
    }),
    optionValue: one(productOptionsValues, {
      fields: [variantOptionValues.optionValueId],
      references: [productOptionsValues.id],
    }),
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
  collectionProducts: many(collectionProducts), // ✅ This is correct
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
export const iventoryTransactionsRelations = relations(
  inventoryTransactions,
  ({ one }) => ({
    variant: one(productVariants, {
      fields: [inventoryTransactions.variantId],
      references: [productVariants.id],
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
}));

// StoreSettings relations
export const storeSettingsRelations = relations(storeSettings, ({ one }) => ({
  store: one(store, {
    fields: [storeSettings.storeId],
    references: [store.id],
  }),
}));
export const catalogsRelations = relations(catalogs, ({ one, many }) => ({
  // Relation to Store
  store: one(store, {
    fields: [catalogs.storeId],
    references: [store.id],
  }),
  // Relation to CatalogProducts (junction table)
  catalogProducts: many(catalogProducts),
}));

// CatalogProducts relations (junction table)
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
