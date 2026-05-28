// components/templates/DefaultTemplate.tsx
import React from "react";

interface StoreData {
  store: {
    name: string;
    logoUrl: string;
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

const DefaultTemplate: React.FC<StoreData> = ({
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
          className="announcement-bar bg-blue-600 text-white text-center py-2"
          style={{ backgroundColor: settings.primaryColor }}
        >
          <p>{settings.announcementText}</p>
        </div>
      )}

      {/* Hero Section */}
      <section
        className="hero-section min-h-[400px] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${settings.heroImage})` }}
      >
        <div className="hero-content text-center text-white p-8 bg-black/50 rounded-lg">
          <h1 className="text-4xl font-bold mb-4">{settings.heroTitle}</h1>
          <p className="text-xl mb-6">{settings.heroSubtitle}</p>
          <button
            className="cta-button px-6 py-3 rounded-lg text-white font-semibold"
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
        {products.length === 0 ? (
          <p className="text-center text-gray-500">
            No products yet. Check back soon!
          </p>
        ) : (
          <div className="products-grid grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="product-card border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <img
                  src={product.thumbnail}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {product.description}
                  </p>
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
        )}
      </div>
    </div>
  );
};

export default DefaultTemplate;
