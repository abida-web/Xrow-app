// components/templates/DefaultTemplate.tsx
import React from "react";

interface StoreData {
  store: {
    name: string;
    logoUrl: string | null;
    currency: string;
  };
  settings: {
    primaryColor: string;
    secondaryColor: string;
    heroTitle: string;
    heroSubtitle: string;
    heroImage: string;
    announcementText: string;
    announcementEnabled: boolean;
    contactEmail: string;
  };
  products: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    compareAtPrice: number | null;
    thumbnail: string;
    slug: string;
  }>;
}

export const DefaultTemplate: React.FC<StoreData> = ({
  store,
  settings,
  products,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: store.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price / 100);
  };

  return (
    <div
      className="store-frontend"
      style={
        { "--primary-color": settings.primaryColor } as React.CSSProperties
      }
    >
      {/* Announcement Bar */}
      {settings.announcementEnabled && (
        <div
          className="announcement-bar"
          style={{ backgroundColor: settings.primaryColor }}
        >
          <p>{settings.announcementText}</p>
        </div>
      )}

      {/* Hero Section */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${settings.heroImage})` }}
      >
        <div className="hero-content">
          <h1>{settings.heroTitle}</h1>
          <p>{settings.heroSubtitle}</p>
          <button
            className="cta-button"
            style={{ backgroundColor: settings.primaryColor }}
          >
            Shop Now
          </button>
        </div>
      </section>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          Featured Products
        </h2>
        <div className="products-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card border rounded-lg overflow-hidden"
            >
              <img
                src={product.thumbnail}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span
                      className="text-2xl font-bold"
                      style={{ color: settings.primaryColor }}
                    >
                      {formatPrice(product.price)}
                    </span>
                    {product.compareAtPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                    )}
                  </div>
                  <button
                    className="px-4 py-2 rounded text-white"
                    style={{ backgroundColor: settings.primaryColor }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
