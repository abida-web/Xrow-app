// app/[storeslug]/page.tsx
"use server";
import { eq, and } from "drizzle-orm";
import { DefaultTemplate } from "@/components/templates/DefaultTemplate";
import { db } from "@/drizzle/db";
import { products } from "@/drizzle/schemas/product-schema";
import { store } from "@/drizzle/schema";

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

  // Fetch ALL products without column restrictions
  const dbProducts = await db.query.products.findMany({
    where: and(
      eq(products.storeId, storeData.id),
      eq(products.status, "active"),
    ),
    limit: 20,
  });

  // Transform to match your template's expected shape
  const allProducts = dbProducts.map((product: any) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    slug: product.slug,
    price: product.price || 0, // Use 0 if price doesn't exist
    compareAtPrice: product.compareAtPrice || null,
    thumbnail:
      product.thumbnail || product.imageUrl || "/placeholder-image.jpg",
  }));

  return (
    <DefaultTemplate
      store={{
        name: storeData.name,
        logoUrl: storeData.logoUrl || "",
        currency: storeData.currency || "USD",
      }}
      settings={storeData.settings}
      products={allProducts}
    />
  );
}
