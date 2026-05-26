import { db } from "@/drizzle/db";
import { products, store } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { shopGaurd } from "@/lib/shopGaurd";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function deleteProduct(productId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  const shopOwner = await db.query.store.findFirst({
    where: eq(store.ownerId, session?.user.id),
  });
  const deleteProduct = await db
    .delete(products)
    .where(
      and(eq(products.storeId, shopOwner?.id), eq(products.id, productId)),
    );
  return { success: 201 };
}
