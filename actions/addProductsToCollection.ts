"use server";
import { db } from "@/drizzle/db";
import {
  catalogProducts,
  catalogs,
  collectionProducts,
  collections,
} from "@/drizzle/schema";
import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getVerifiedStoreBySlug } from "@/lib/store-utils";

export async function addProductsToCollection(
  storeslug: string,
  productIds: string[],
  collectionId: string,
) {
  const storeOwner = await getVerifiedStoreBySlug(storeslug);

  const collection = await db.query.collections.findFirst({
    where: and(
      eq(collections.id, collectionId),
      eq(collections.storeId, storeOwner.id),
    ),
  });

  if (!collection) {
    throw new Error("Collection not found or doesn't belong to this store");
  }

  const existingAssignments = await db.query.collectionProducts.findMany({
    where: and(
      inArray(collectionProducts.productId, productIds),
      eq(collectionProducts.collectionId, collectionId),
    ),
  });

  const existingProductIds = new Set(
    existingAssignments.map((a) => a.productId),
  );

  const newProductIds = productIds.filter((id) => !existingProductIds.has(id));

  if (newProductIds.length === 0) {
    return {
      success: false,
      message: "All selected products are already in this collection",
    };
  }

  await db.insert(collectionProducts).values(
    newProductIds.map((productId) => ({
      productId: productId,
      collectionId: collectionId,
    })),
  );

  revalidatePath(`/dashboard/${storeOwner.slug}/products`);

  return {
    success: true,
    message: `Successfully added ${newProductIds.length} product(s) to collection`,
  };
}
