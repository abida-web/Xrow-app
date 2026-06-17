"use server";
import { db } from "@/drizzle/db";
import { catalogProducts, catalogs } from "@/drizzle/schema";
import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getVerifiedStoreBySlug } from "@/lib/store-utils";

export async function excludeFromCatalog(
  storeslug: string,
  productIds: string[],
  catalogId: string,
) {
  const storeOwner = await getVerifiedStoreBySlug(storeslug);

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

  if (existingAssignments.length === 0) {
    return {
      success: false,
      message: "None of the selected products are in this catalog",
      removedCount: 0,
    };
  }

  const existingProductIds = existingAssignments.map((a) => a.productId);

  await db
    .update(catalogProducts)
    .set({ isAtCatalog: false })
    .where(
      and(
        inArray(catalogProducts.productId, existingProductIds),
        eq(catalogProducts.catalogId, catalogId),
      ),
    );

  revalidatePath(`/dashboard/${storeOwner.slug}/products`);

  return {
    success: true,
    message: `Successfully removed ${existingProductIds.length} product(s) from catalog`,
    removedCount: existingProductIds.length,
    notFoundCount: productIds.length - existingProductIds.length,
  };
}
