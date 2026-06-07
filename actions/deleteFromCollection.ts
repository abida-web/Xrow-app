"use server";
import { db } from "@/drizzle/db";
import {
  catalogProducts,
  catalogs,
  collectionProducts,
  collections,
  store,
} from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { and, eq, inArray } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function removeFromCollection(
  productIds: string[],
  collectionId: string,
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const storeOwner = await db.query.store.findFirst({
    where: eq(store.ownerId, session.user.id),
  });

  if (!storeOwner) {
    throw new Error("Store not found");
  }

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
