"use server";
import { db } from "@/drizzle/db";
import { products } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { getVerifiedStoreBySlug } from "@/lib/store-utils";

export async function getAllproducts(storeslug: string) {
  if (!storeslug) {
    throw new Error("Store slug is required");
  }

  const shopOwner = await getVerifiedStoreBySlug(storeslug);

  if (!shopOwner?.id) {
    throw new Error("Store not found");
  }

  const getProducts = await db.query.products.findMany({
    where: eq(products.storeId, shopOwner.id),
    with: {
      images: true,
      category: true,
      variants: true,
      catalogProducts: {
        with: {
          catalog: true,
        },
      },
    },
  });

  return getProducts;
}
