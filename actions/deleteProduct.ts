"use server";

import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { products } from "@/drizzle/schema";
import { revalidatePath } from "next/cache";
import { getVerifiedStoreBySlug } from "@/lib/store-utils";

export async function deleteProducts(storeslug: string, productIds: string[]) {
  try {
    const shopOwner = await getVerifiedStoreBySlug(storeslug);

    console.log("Deleting products:", productIds);
    console.log("Store ID:", shopOwner.id);

    // Delete products
    const result = await db
      .delete(products)
      .where(
        and(
          inArray(products.id, productIds),
          eq(products.storeId, shopOwner.id),
        ),
      )
      .returning();

    revalidatePath(`/dashboard/${shopOwner.slug}/products`);

    return { success: true, deletedCount: result.length };
  } catch (error) {
    console.error("Delete products error:", error);
    throw new Error(`Failed to delete products: ${error}`);
  }
}
