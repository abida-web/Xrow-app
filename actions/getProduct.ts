"use server";
import { db } from "@/drizzle/db";
import { products } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { getVerifiedStoreBySlug } from "@/lib/store-utils";

export async function getProduct(productId: string, storeslug: string) {
  const shopOwner = await getVerifiedStoreBySlug(storeslug);

  const getProducts = await db.query.products.findFirst({
    where: and(eq(products.storeId, shopOwner.id), eq(products.id, productId)),
    with: {
      variants: true,
      images: true,
      tags: true,
    },
  });

  return getProducts;
}
