"use server";
import { db } from "@/drizzle/db";
import { products, store } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { and, eq, inArray } from "drizzle-orm";
import { headers } from "next/headers";

export const updatedProductStatus = async (
  status: string,
  productIds: string[],
) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("unauthorized");
  }
  const storeOwner = await db.query.store.findFirst({
    where: eq(store.ownerId, session.user.id),
  });
  if (!storeOwner?.id) {
    throw new Error("Store not found");
  }

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
