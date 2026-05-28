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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Store unavailable</p>
      </div>
    );
  }

  const allProducts = products.map((product: any) => ({
    id: product.id,
    name: product.name || "Untitled Product",
    description: product.description || "",
    slug: product.slug || product.id,
    price: product.price || 0,
    compareAtPrice: product.compareAtPrice || null,
    thumbnail: product.thumbnail || "/placeholder-image.jpg",
    stock: product.stock || 0,
    status: product.status || "active",
  }));

  const settings = {
    primaryColor: store.settings?.primaryColor || "#000000",
    secondaryColor: store.settings?.secondaryColor || "#f0f0f0",
    heroTitle: store.settings?.heroTitle || "",
    heroSubtitle: store.settings?.heroSubtitle || "",
    heroImage: store.settings?.heroImage || "",
    announcementText: store.settings?.announcementText || "",
    announcementEnabled: store.settings?.announcementEnabled || false,
    contactEmail: store.settings?.contactEmail || "",
  };

  return <DefaultTemplate settings={settings} products={allProducts} />;
}
