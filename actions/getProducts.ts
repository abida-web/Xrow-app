import { db } from "@/drizzle/db";
import { products, store } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function getAllproducts(storeslug: string) {
  // For public store access, we don't need authentication
  // But we need to validate the store exists

  if (!storeslug) {
    throw new Error("Store slug is required");
  }

  const shopOwner = await db.query.store.findFirst({
    where: eq(store.slug, storeslug),
  });

  if (!shopOwner?.id) {
    throw new Error("Store not found");
  }

  const getProducts = await db
    .select()
    .from(products)
    .where(eq(products.storeId, shopOwner.id));

  return getProducts;
}
