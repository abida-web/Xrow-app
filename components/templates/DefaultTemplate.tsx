"use client";
import React, { useState } from "react";
import Image from "next/image";

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
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState<Record<string, boolean>>({});

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: store.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price / 100);
  };

  const handleAddToCart = (productId: string) => {
    setAddedToCart({ ...addedToCart, [productId]: true });
    setTimeout(() => {
      setAddedToCart({ ...addedToCart, [productId]: false });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Announcement Bar */}
      {settings.announcementEnabled && (
        <div
          className="relative overflow-hidden bg-gradient-to-r from-primary via-primary/90 to-primary text-white py-3 px-4"
          style={{ backgroundColor: settings.primaryColor }}
        >
          <div className="container mx-auto text-center">
            <p className="text-sm md:text-base font-medium animate-pulse">
              ✨ {settings.announcementText} ✨
            </p>
          </div>
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${settings.heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />
        </div>

        {/* Animated particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="animate-fade-in-up">
            {store.logoUrl && (
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md p-1">
                  <Image
                    src={store.logoUrl}
                    alt={store.name}
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                </div>
              </div>
            )}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
              {settings.heroTitle}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              {settings.heroSubtitle}
            </p>
            <button
              className="group relative px-8 py-3 md:px-10 md:py-4 bg-white text-gray-900 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
              style={{
                backgroundColor: settings.primaryColor,
                color: "white",
              }}
            >
              <span className="relative z-10">Shop Now →</span>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </button>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <div
            className="w-24 h-1 rounded-full mx-auto"
            style={{ backgroundColor: settings.primaryColor }}
          />
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Discover our curated collection of premium products
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <Image
                  src={
                    imageErrors[product.id]
                      ? `https://placehold.co/600x600/f9fafb/9ca3af?text=${encodeURIComponent(product.name)}`
                      : product.thumbnail
                  }
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  onError={() =>
                    setImageErrors({ ...imageErrors, [product.id]: true })
                  }
                />

                {/* Discount Badge */}
                {product.compareAtPrice &&
                  product.compareAtPrice > product.price && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="bg-red-500 text-white text-xs md:text-sm font-bold px-2 py-1 rounded-full shadow-lg transform rotate-12">
                        {Math.round(
                          (1 - product.price / product.compareAtPrice) * 100,
                        )}
                        % OFF
                      </div>
                    </div>
                  )}

                {/* Quick View Overlay */}
                <div
                  className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${hoveredProduct === product.id ? "opacity-100" : "opacity-0"}`}
                >
                  <button className="px-6 py-2 bg-white text-gray-900 rounded-full font-semibold text-sm transform transition-all duration-300 hover:scale-105">
                    Quick View
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-2xl md:text-3xl font-bold"
                      style={{ color: settings.primaryColor }}
                    >
                      {formatPrice(product.price)}
                    </span>
                    {product.compareAtPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                    )}
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleAddToCart(product.id)}
                  className="w-full py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 relative overflow-hidden"
                  style={{
                    backgroundColor: settings.primaryColor,
                    color: "white",
                  }}
                >
                  <span
                    className={`inline-flex items-center gap-2 transition-all duration-300 ${addedToCart[product.id] ? "opacity-0" : "opacity-100"}`}
                  >
                    Add to Cart
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M18 13l1.5 6M9 21h6M12 18v3"
                      />
                    </svg>
                  </span>
                  <span
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${addedToCart[product.id] ? "opacity-100" : "opacity-0"}`}
                  >
                    Added! ✓
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-16 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Stay Updated
          </h3>
          <p className="text-gray-300 mb-6">
            Subscribe to get special offers, free giveaways, and exclusive
            deals.
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full focus:outline-none focus:ring-2"
              style={{ focusRingColor: settings.primaryColor }}
            />
            <button
              className="px-8 py-3 rounded-full font-semibold transition-all hover:scale-105"
              style={{
                backgroundColor: settings.primaryColor,
                color: "white",
              }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2024 {store.name}. All rights reserved.</p>
          <p className="text-sm mt-2">
            Contact us:{" "}
            <a
              href={`mailto:${settings.contactEmail}`}
              className="hover:underline"
              style={{ color: settings.primaryColor }}
            >
              {settings.contactEmail}
            </a>
          </p>
        </div>
      </footer>

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(200%);
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-float {
          animation: float linear infinite;
        }
        .animate-\[shimmer_2s_infinite\] {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};
