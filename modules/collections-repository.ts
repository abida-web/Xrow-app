// modules/collections-repository.ts
import { collectionProducts, collections } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const collectionRepository = {
  async getAllCollection(db: any, storeId: string) {
    return db.query.collections.findMany({
      where: eq(collections.storeId, storeId),
      with: {
        collectionProducts: {
          with: {
            product: true,
          },
        },
      },
    });
  },
  async createCollection(db: any, data: any) {
    return db.insert(collections).values(data);
  },
  async addProToCollection(db: any, data: any) {
    return db.insert(collectionProducts).values(data);
  },
};
