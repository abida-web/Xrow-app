"use server";
import { db } from "@/drizzle/db";
import { catalogProducts, catalogs, store } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { and, eq, inArray } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function addProductToCatalog(
  productIds: string[],
  catalogId: string,
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const storeOwner = await db.query.store.findFirst({
    where: eq(store.ownerId, session.user.id),
  });

  if (!storeOwner) {
    throw new Error("Store not found");
  }

  const catalog = await db.query.catalogs.findFirst({
    where: and(eq(catalogs.id, catalogId), eq(catalogs.storeId, storeOwner.id)),
  });

  if (!catalog) {
    throw new Error("Catalog not found or doesn't belong to this store");
  }

  const existingAssignments = await db.query.catalogProducts.findMany({
    where: and(
      inArray(catalogProducts.productId, productIds),
      eq(catalogProducts.catalogId, catalogId),
    ),
  });

  const existingProductIds = new Set(
    existingAssignments.map((a) => a.productId),
  );

  const newProductIds = productIds.filter((id) => !existingProductIds.has(id));

  if (newProductIds.length === 0) {
    return {
      success: false,
      message: "All selected products are already in this catalog",
    };
  }

  await db.insert(catalogProducts).values(
    newProductIds.map((productId) => ({
      productId: productId,
      catalogId: catalogId,
      isAtCatalog: true,
    })),
  );

  revalidatePath(`/dashboard/${storeOwner.slug}/products`);

  return {
    success: true,
    message: `Successfully added ${newProductIds.length} product(s) to catalog`,
  };
}
