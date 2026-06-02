"use server";
import { db } from "@/drizzle/db";
import { products, store } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function getProduct(productId: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  // Check authentication first
  if (!session?.user?.id) {
    throw new Error("Unauthorized: User not authenticated");
  }

  const shopOwner = await db.query.store.findFirst({
    where: eq(store.ownerId, session.user.id),
  });

  if (!shopOwner?.id) {
    throw new Error("Store not found");
  }

  const getProducts = await db.query.products.findFirst({
    where: and(eq(products.storeId, shopOwner.id), eq(products.id, productId)),
    with: {
      variants: true,
      images: true,
      options: {
        with: {
          values: true,
        },
      },
      tags: true,
    },
  });

  return getProducts;
}
