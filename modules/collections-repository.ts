// modules/collections-repository.ts
import { collections } from "@/drizzle/schema";
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
};
