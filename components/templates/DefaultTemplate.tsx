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
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Announcement Bar */}
      {settings.announcementEnabled && settings.announcementText && (
        <p
          className={` text-white text-center py-2 px-4 text-sm`}
          style={{
            background: settings.secondaryColor,
            color: settings.primaryColor,
          }}
        >
          {settings.announcementText}
        </p>
      )}

      {/* Hero Section */}
      <div className="relative">
        {settings.heroImage && (
          <div className="h-full w-full overflow-hidden">
            <img
              src={settings.heroImage}
              alt={settings.heroTitle}
              className="w-full h-full"
            />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 mt-15 sm:px-6 lg:px-8 py-16 absolute top-0 left-0 right-0 z-10">
          {settings.heroSubtitle && (
            <h1
              className={`text-6xl max-w-2xl font-semibold ${settings.heroImage ? "text-gray-200" : "text-gray-600"}`}
            >
              {settings.heroSubtitle}
            </h1>
          )}
          <button
            className="py-1.5 mt-4 px-5 rounded-sm"
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
            <p className="text-gray-500">No products available.</p>
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
                      ${product.price.toFixed(2)}
                    </span>
                    {product.compareAtPrice &&
                      product.compareAtPrice > product.price && (
                        <span className="text-sm text-gray-400 line-through">
                          ${product.compareAtPrice.toFixed(2)}
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
                    className="mt-3 w-full px-4 py-2 text-white text-sm rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              © 2024 {settings.heroTitle.replace("Welcome to ", "")} All rights
              reserved.
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
