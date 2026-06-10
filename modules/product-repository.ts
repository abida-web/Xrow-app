import {
  categories,
  inventoryTransactions,
  productImages,
  products,
  productTags,
  productVariants,
} from "@/drizzle/schema";

// product-repository.ts
export const productRepository = {
  async createCategory(db: any, data: any) {
    return db.insert(categories).values(data).returning();
  },
  async createProduct(db: any, data: any) {
    const [product] = await db.insert(products).values(data).returning();
    return product;
  },
  async createImages(db: any, data: any[]) {
    return db.insert(productImages).values(data).returning();
  },
  async createVarients(db: any, data: any[]) {
    return db.insert(productVariants).values(data).returning();
  },
  async createTags(db: any, data: any[]) {
    return db.insert(productTags).values(data).returning();
  },
  async createInventory(db: any, data: any[]) {
    return db.insert(inventoryTransactions).values(data).returning();
  },
};
