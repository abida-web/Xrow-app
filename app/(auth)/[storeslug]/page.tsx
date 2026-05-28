import { getStore } from "@/actions/getStore";
import DefaultTemplate from "@/components/templates/DefaultTemplate";

export default async function StorePage({
  params,
}: {
  params: Promise<{ storeslug: string }>;
}) {
  const { storeslug } = await params;
  const { products, store } = await getStore(storeslug);
  if (!store) {
    return <p>Store unavailable</p>;
  }
  const allProducts = products.map((product: any) => ({
    id: product.id,
    name: product.name || "Untitled Product",
    description: product.description || "",
    slug: product.slug || product.id,
    price: product.price || 0,
    compareAtPrice: product.compareAtPrice || null,
    thumbnail: product.thumbnail || "/placeholder-image.jpg",
  }));

  const settings = store.settings && {
    primaryColor: store.settings.primaryColor,
    secondaryColor: store.settings.secondaryColor,
    heroTitle: store.settings.heroTitle,
    heroSubtitle: store.settings.heroSubtitle,
    heroImage: store.settings.heroImage,
    announcementText: store.settings.announcementText,
    announcementEnabled: store.settings.announcementEnabled,
    contactEmail: store.settings.contactEmail,
  };

  return <DefaultTemplate settings={settings} products={allProducts} />;
}
