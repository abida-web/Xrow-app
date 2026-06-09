"use server";
import { db } from "@/drizzle/db";
import { collections, store, collectionProducts } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function getCollection(collectionId: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const shopOwner = await db.query.store.findFirst({
    where: eq(store.ownerId, session.user.id),
  });

  if (!shopOwner?.id) {
    throw new Error("Store not found");
  }

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
