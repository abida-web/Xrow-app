// product-repository.ts
import {
  categories,
  inventoryLevels,
  locations,
  productImages,
  products,
  productTags,
  productVariants,
} from "@/drizzle/schema";
import { eq } from "drizzle-orm";

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

  async createVariants(db: any, data: any[]) {
    return db.insert(productVariants).values(data).returning();
  },

  async createTags(db: any, data: any[]) {
    return db.insert(productTags).values(data).returning();
  },

  // NEW: Create inventory levels for variants across locations
  async createInventoryLevels(db: any, data: any[]) {
    return db.insert(inventoryLevels).values(data).returning();
  },

  // NEW: Get store locations
  async getStoreLocations(db: any, storeId: string) {
    return db.select().from(locations).where(eq(locations.storeId, storeId));
  },
};
