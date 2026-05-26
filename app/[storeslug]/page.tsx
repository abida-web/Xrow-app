"use server";
import { eq, and } from "drizzle-orm";
import { DefaultTemplate } from "@/components/templates/DefaultTemplate";
import { db } from "@/drizzle/db";
import { products, store } from "@/drizzle/schema";

export default async function StorePage({
  params,
}: {
  params: Promise<{ storeSlug: string }>;
}) {
  const { storeSlug } = await params;
  const storeData = await db.query.store.findFirst({
    where: eq(store.slug, storeSlug),
    with: {
      settings: true,
    },
  });

  if (!storeData) {
    return <div>Store not found</div>;
  }

  // Fetch active products for this store
  const Allproducts = await db.query.products.findMany({
    where: and(
      eq(products.storeId, storeData.id),
      eq(products.status, "active"),
    ),
    limit: 20,
  });

  return (
    <DefaultTemplate
      store={{
        name: storeData.name,
        logoUrl: storeData.logoUrl,
        currency: storeData.currency,
      }}
      settings={storeData.settings}
      products={products}
    />
  );
}
