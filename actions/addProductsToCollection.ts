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

export async function addProductsToCollection(
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
