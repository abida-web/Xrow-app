"use server";

import { db } from "@/drizzle/db";
import { productVariants, products, store } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export const getInventory = async () => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
      return [];
    }

    const storeOwner = await db.query.store.findFirst({
      where: eq(store.ownerId, session.user.id),
    });

    if (!storeOwner) {
      return [];
    }

    // Get all product variants for this store by joining with products table
    const variants = await db
      .select({
        id: productVariants.id,
        name: productVariants.title,
        sku: productVariants.sku,
        price: productVariants.price,
        inventoryQuantity: productVariants.inventoryQuantity,
        productId: productVariants.productId,
      })
      .from(productVariants)
      .innerJoin(products, eq(productVariants.productId, products.id))
      .where(eq(products.storeId, storeOwner.id))
      .orderBy(productVariants.title);

    return variants;
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return [];
  }
};
