"use client";
import { deleteGiftCard, getGiftCards } from "@/actions/getGiftCards";
import { Gift, GiftIcon, Trash } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface GiftCard {
  id: string;
  code: string;
  initialValue: string;
  balance: string | null;
  currency: string | null;
  note: string | null;
  expiresOn: string | null;
  createdAt: string | null;
}

const GiftCards = () => {
  const params = useParams();
  const storeslug = String(params.storeslug);
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGiftCards();
  }, [storeslug]);

  const fetchGiftCards = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getGiftCards(storeslug);
      console.log("Fetched result:", result);
      if (Array.isArray(result)) {
        setGiftCards(result);
      } else {
        setGiftCards([]);
      }
    } catch (err) {
      console.error("Error fetching gift cards:", err);
      setError("Failed to fetch gift cards");
      setGiftCards([]);
    } finally {
      setIsLoading(false);
    }
  };
  const deleteCard = (cardId: string) => {
    const card = deleteGiftCard(storeslug, cardId);
    setGiftCards(giftCards.filter((card) => card.id !== cardId));
  };
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="flex items-center gap-2 text-xl font-semibold">
            <Gift className="h-5 w-5" />
            Gift Cards
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="flex items-center gap-2 text-xl font-semibold">
            <Gift className="h-5 w-5" />
            Gift Cards
          </h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          Error: {error}
        </div>
        <button
          onClick={fetchGiftCards}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (giftCards.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="flex items-center gap-2 text-xl font-semibold">
            <Gift className="h-5 w-5" />
            Gift Cards
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="bg-gray-200 p-6 rounded-full flex items-center justify-center">
            <GiftIcon className="w-12 h-12 text-[#06102c]" />
          </div>
          <h1 className="text-lg font-semibold mt-6">No gift cards yet</h1>
          <p className="text-gray-500 text-sm mt-2 text-center max-w-md">
            Gift cards sold or sent to customers will show up here.
          </p>
          <Link
            className="px-5 py-2 mt-6 bg-[#06102c] rounded-md text-sm text-white hover:bg-[#0a1a3a] transition-colors"
            href={`/dashboard/${storeslug}/gift-cards/new`}
          >
            Create gift card
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="flex items-center gap-2 text-xl font-semibold">
          <Gift className="h-5 w-5" />
          Gift Cards
          <span className="text-sm font-normal text-gray-500">
            ({giftCards.length} total)
          </span>
        </h1>
        <Link
          className="px-4 py-2 bg-[#06102c] rounded-md text-sm text-white hover:bg-[#0a1a3a] transition-colors"
          href={`/dashboard/${storeslug}/gift-cards/new`}
        >
          Create new
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {giftCards.map((card) => (
          <div
            key={card.id}
            className="border rounded-lg p-3 hover:shadow-lg transition-shadow flex gap-3"
          >
            {/* Icon Section */}
            <div className=" flex flex-col justify-between flex-shrink-0">
              <div className="bg-gray-200 p-3 rounded-full flex items-center justify-center">
                <GiftIcon className="w-8 h-8 text-[#06102c]" />
              </div>
              <button
                onClick={() => deleteCard(card.id)}
                className="bg-red-100 p-1 w-fit rounded text-red-400"
              >
                <Trash className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Details Section */}
            <div className="flex-1 min-w-0">
              <p className="font-mono font-semibold text-sm truncate">
                {card.code}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Initial: {card.currency} {card.initialValue}
              </p>
              <p className="text-sm font-semibold text-green-600">
                Balance: {card.currency} {card.balance}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Expires:{" "}
                {card.expiresOn
                  ? new Date(card.expiresOn).toLocaleDateString()
                  : "No expiry"}
              </p>
              {card.note && (
                <p className="text-xs text-gray-400 mt-2 truncate">
                  📝 {card.note}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GiftCards;
