import { featureCards } from "@/app/constants/services";
import { Brain, ShoppingCart, Zap } from "lucide-react";
import React from "react";

const Services = () => {
  const iconMap: Record<string, any> = {
    ShoppingCart: ShoppingCart,
    Brain: Brain,
    Zap: Zap,
  };

  return (
    <div className="bg-[#06102c] text-white mt-5 rounded-t-4xl p-5 md:px-20">
      <h1 className="text-xl sm:text-3xl lg:text-4xl my-10 font-bold">
        Smarter selling starts here
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-stretch">
        {featureCards.map((card) => {
          const Icon = iconMap[card.iconName];
          return (
            <div
              key={card.id}
              className="flex flex-col items-center justify-center bg-[#16203a] rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 text-center h-full"
            >
              <div className="w-16 h-16 flex items-center justify-center mb-4">
                <Icon className="w-8 h-8 text-gray-300 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-100">
                {card.title}
              </h3>
              <p className="text-gray-400 leading-relaxed max-w-xs">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-12 max-w-2xl">
        <p className="text-xl sm:text-2xl italic text-gray-200">
          "Every Shopify plan comes with unlimited storage...and products, which
          means Shopify scales beautifully as your business grows."
        </p>
        <div className="mt-6">
          <p className="font-semibold text-lg">Foxnews</p>
          <p className="text-gray-500 text-sm sm:text-lg">
            Janette Novak — Advisor
          </p>
        </div>
      </div>
    </div>
  );
};

export default Services;
