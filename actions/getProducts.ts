import { db } from "@/drizzle/db";
import { products, store } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { shopGaurd } from "@/lib/shopGaurd";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function getAllproducts(storeslug: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  const shopOwner = await db.query.store.findFirst({
    where: eq(store.slug, storeslug),
  });
  const getProducts = await db
    .select()
    .from(products)
    .where(eq(products.storeId, shopOwner?.id));
  return getProducts;
}
