import React from "react";

// Product Type
type Product = {
  id: string;
  name: string;
  description: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  thumbnail: string;
  stock?: number;
  status?: string;
};

// Settings Type
type Settings = {
  primaryColor: string;
  secondaryColor: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  announcementText: string;
  announcementEnabled: boolean;
  contactEmail: string;
};

// Component Props Type
type DefaultTemplateProps = {
  settings: Settings;
  products: Product[];
};

const DefaultTemplate: React.FC<DefaultTemplateProps> = ({
  settings,
  products,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price / 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Announcement Bar */}
      {settings.announcementEnabled && settings.announcementText && (
        <div
          className="text-white text-center py-2 px-4 text-sm"
          style={{
            background: settings.secondaryColor,
            color: settings.primaryColor,
          }}
        >
          {settings.announcementText}
        </div>
      )}

      {/* Hero Section */}
      <div className="relative">
        {settings.heroImage && (
          <div className="h-full w-full overflow-hidden">
            <img
              src={settings.heroImage}
              alt={settings.heroTitle}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          {settings.heroSubtitle && (
            <h1
              className={`text-6xl max-w-2xl font-semibold ${
                settings.heroImage ? "text-white" : "text-gray-900"
              }`}
            >
              {settings.heroSubtitle}
            </h1>
          )}
          <button
            className="py-1.5 mt-4 px-5 rounded-sm font-semibold"
            style={{
              background: settings.secondaryColor,
              color: settings.primaryColor,
            }}
          >
            Shop Now
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {products?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No products available. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                {/* Product Image */}
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {product.name}
                  </h3>

                  {product.description && (
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className="text-lg font-bold"
                      style={{ color: settings.primaryColor }}
                    >
                      {formatPrice(product.price)}
                    </span>
                    {product.compareAtPrice &&
                      product.compareAtPrice > product.price && (
                        <span className="text-sm text-gray-400 line-through">
                          {formatPrice(product.compareAtPrice)}
                        </span>
                      )}
                  </div>

                  {/* Stock Status */}
                  {product.stock !== undefined && (
                    <div className="mt-2">
                      {product.stock > 0 ? (
                        <span className="text-xs text-green-600">
                          In Stock ({product.stock})
                        </span>
                      ) : (
                        <span className="text-xs text-red-600">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  )}

                  {/* Add to Cart Button */}
                  <button
                    className="mt-3 w-full px-4 py-2 text-white text-sm rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                    style={{
                      backgroundColor: settings.primaryColor,
                    }}
                    disabled={product.stock === 0}
                    onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) =>
                      (e.currentTarget.style.backgroundColor =
                        settings.secondaryColor)
                    }
                    onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) =>
                      (e.currentTarget.style.backgroundColor =
                        settings.primaryColor)
                    }
                  >
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 text-sm">
            <p>
              © 2024 {settings.heroTitle?.replace("Welcome to ", "") || "Store"}{" "}
              All rights reserved.
            </p>
            {settings.contactEmail && (
              <p className="mt-2">
                Contact:{" "}
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="hover:underline"
                  style={{ color: settings.primaryColor }}
                >
                  {settings.contactEmail}
                </a>
              </p>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DefaultTemplate;
