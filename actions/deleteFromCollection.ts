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

export async function removeFromCollection(
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
    throw new Error("Catalog not found or doesn't belong to this store");
  }

  const existingAssignments = await db.query.catalogProducts.findMany({
    where: and(
      inArray(collectionProducts.productId, productIds),
      eq(collectionProducts.collectionId, collectionId),
    ),
  });

  if (existingAssignments.length === 0) {
    return {
      success: false,
      message: "None of the selected products are in this collections",
      removedCount: 0,
    };
  }

  const existingProductIds = existingAssignments.map((a) => a.productId);

  await db
    .delete(catalogProducts)
    .where(
      and(
        inArray(collectionProducts.productId, existingProductIds),
        eq(collectionProducts.collectionId, collectionId),
      ),
    );

  revalidatePath(`/dashboard/${storeOwner.slug}/products`);

  return {
    success: true,
    message: `Successfully removed ${existingProductIds.length} product(s) from collection`,
    removedCount: existingProductIds.length,
    notFoundCount: productIds.length - existingProductIds.length,
  };
}
