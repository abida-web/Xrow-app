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
  params: Promise<{ storeslug: string }>;
}) {
  const { storeslug } = await params;

  // Now this will work because relations are imported
  const storeData = await db.query.store.findFirst({
    where: eq(store.slug, storeslug),
    with: {
      settings: true, // This should now work!
    },
  });

  if (!storeData) {
    return <div>Store not found</div>;
  }

  // Fetch products
  const dbProducts = await db.query.products.findMany({
    where: and(
      eq(products.storeId, storeData.id),
      eq(products.status, "active"),
    ),
    limit: 20,
  });

  // Transform products
  const allProducts = dbProducts.map((product: any) => ({
    id: product.id,
    name: product.name || "Untitled Product",
    description: product.description || "",
    slug: product.slug || product.id,
    price: product.price || 0,
    compareAtPrice: product.compareAtPrice || null,
    thumbnail: product.thumbnail || "/placeholder-image.jpg",
  }));

  // Provide defaults for settings (in case any fields are null)
  const settings = storeData.settings
    ? {
        primaryColor: storeData.settings.primaryColor ?? "#3B82F6",
        secondaryColor: storeData.settings.secondaryColor ?? "#10B981",
        heroTitle:
          storeData.settings.heroTitle ?? `Welcome to ${storeData.name}!`,
        heroSubtitle:
          storeData.settings.heroSubtitle ??
          "Discover amazing products at great prices",
        heroImage: storeData.settings.heroImage ?? "/default-hero.jpg",
        announcementText:
          storeData.settings.announcementText ??
          "Free shipping on orders over $50!",
        announcementEnabled: storeData.settings.announcementEnabled ?? true,
        contactEmail:
          storeData.settings.contactEmail ?? `hello@${storeData.slug}.com`,
      }
    : {
        // Fallback if no settings exist
        primaryColor: "#3B82F6",
        secondaryColor: "#10B981",
        heroTitle: `Welcome to ${storeData.name}!`,
        heroSubtitle: "Discover amazing products at great prices",
        heroImage: "/default-hero.jpg",
        announcementText: "Free shipping on orders over $50!",
        announcementEnabled: true,
        contactEmail: `hello@${storeData.slug}.com`,
      };

  return (
    <DefaultTemplate
      store={{
        name: storeData.name,
        logoUrl: storeData.logoUrl || "",
        currency: storeData.currency || "USD",
      }}
      settings={settings}
      products={allProducts}
    />
  );
}
