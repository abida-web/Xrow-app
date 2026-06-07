"use server";

import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { products, store } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function deleteProducts(productIds: string[]) {
  try {
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
