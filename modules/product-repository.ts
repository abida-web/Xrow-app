import {
  productImages,
  productOptions,
  productOptionsValues,
  products,
  productTags,
  productVariants,
  variantOptionValues,
} from "@/drizzle/schema";

// product-repository.ts
export const productRepository = {
  async createProduct(db: any, data: any) {
    const [product] = await db.insert(products).values(data).returning();
    return product;
  },
  async createImages(db: any, data: any[]) {
    return db.insert(productImages).values(data).returning();
  },
  async createOptions(db: any, data: any[]) {
    return db.insert(productOptions).values(data).returning();
  },
  async createOptionValues(db: any, data: any[]) {
    return db.insert(productOptionsValues).values(data).returning();
  },
  async createVarients(db: any, data: any[]) {
    return db.insert(productVariants).values(data).returning();
  },
  async createVarientLinks(db: any, data: any[]) {
    return db.insert(variantOptionValues).values(data);
  },
  async createTags(db: any, data: any[]) {
    return db.insert(productTags).values(data).returning();
  },
};
