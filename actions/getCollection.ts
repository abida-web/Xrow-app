"use server";
import { db } from "@/drizzle/db";
import { collections, collectionProducts } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { getVerifiedStoreBySlug } from "@/lib/store-utils";

export async function getCollection(collectionId: string, storeslug: string) {
  const shopOwner = await getVerifiedStoreBySlug(storeslug);

  const collection = await db.query.collections.findFirst({
    where: and(
      eq(collections.storeId, shopOwner.id),
      eq(collections.id, collectionId),
    ),
    with: {
      collectionProducts: {
        with: {
          product: true,
        },
      },
    },
  });

  if (!collection) {
    throw new Error("Collection not found");
  }

  // Transform the data to include product IDs
  const transformedCollection = {
    ...collection,
    productIds: collection.collectionProducts?.map((cp) => cp.productId) || [],
    products: collection.collectionProducts?.map((cp) => cp.product) || [],
  };

  return transformedCollection;
}
