"use server";
import { db } from "@/drizzle/db";
import { products } from "@/drizzle/schema";
import { and, eq, inArray } from "drizzle-orm";
import { getVerifiedStoreBySlug } from "@/lib/store-utils";

export const updatedProductStatus = async (
  storeslug: string,
  status: string,
  productIds: string[],
) => {
  const storeOwner = await getVerifiedStoreBySlug(storeslug);

  const update = await db
    .update(products)
    .set({ status: status })
    .where(
      and(
        inArray(products.id, productIds),
        eq(products.storeId, storeOwner?.id),
      ),
    )
    .returning();
  return { success: true, products: update };
};
