"use client";

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

      {/* Hero Section - Fixed with Tailwind only */}
      <div className="relative w-full">
        {/* Hero Image Container - Fixed height with Tailwind */}
        <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
          {settings.heroImage && (
            <img
              src={settings.heroImage}
              alt={settings.heroTitle}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Hero Content - Centered overlay */}
        <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-7xl mx-auto w-full">
            {settings.heroSubtitle && (
              <h1
                className={`
                  text-4xl sm:text-5xl lg:text-6xl 
                  font-semibold max-w-2xl
                  ${settings.heroImage ? "text-white drop-shadow-lg" : "text-gray-900"}
                `}
              >
                {settings.heroSubtitle}
              </h1>
            )}
            <button
              className="mt-4 px-5 py-1.5 rounded-sm font-semibold hover:opacity-90 transition-opacity"
              style={{
                background: settings.secondaryColor,
                color: settings.primaryColor,
              }}
            >
              Shop Now
            </button>
          </div>
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
                {/* Product Image - Fixed to use thumbnail */}
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

                  {/* Add to Cart Button - Fixed hover to maintain text color */}
                  <button
                    className="mt-3 w-full px-4 py-2 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    style={{
                      backgroundColor: settings.primaryColor,
                      color: "#ffffff",
                    }}
                    disabled={product.stock === 0}
                    onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.currentTarget.style.backgroundColor =
                        settings.secondaryColor;
                      e.currentTarget.style.color = settings.primaryColor;
                    }}
                    onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.currentTarget.style.backgroundColor =
                        settings.primaryColor;
                      e.currentTarget.style.color = "#ffffff";
                    }}
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
