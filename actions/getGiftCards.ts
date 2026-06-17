"use server";
import { db } from "@/drizzle/db";
import { giftCards } from "@/drizzle/schema";
import { getVerifiedStoreBySlug } from "@/lib/store-utils";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getGiftCards(storeslug: string) {
  try {
    const store = await getVerifiedStoreBySlug(storeslug);

    if (!store) {
      return "Store not found";
    }

    const giftCardsList = await db.query.giftCards.findMany({
      where: eq(giftCards.storeId, store.id),
      orderBy: (giftCard, { desc }) => [desc(giftCards.createdAt)],
    });
    const transformedGiftCards = giftCardsList.map((card) => ({
      id: card.id,
      code: card.code,
      codeHash: card.codeHash,
      initialValue: card.initialValue,
      balance: card.balance,
      currency: card.currency,
      note: card.note,
      expiresOn: card.expiresOn ? card.expiresOn.toISOString() : null, // Date → string
      createdAt: card.createdAt ? card.createdAt.toISOString() : null, // Date → string
      storeId: card.storeId,
      enabled: card.enabled,
      customerId: card.customerId,
      orderId: card.orderId,
      recipientEmail: card.recipientEmail,
      recipientMessage: card.recipientMessage,
    }));
    return transformedGiftCards;
  } catch (error) {
    console.error("Error:", error);
    return { error: "Failed to fetch gift cards", giftCards: [] };
  }
}
export async function deleteGiftCard(storeslug: string, cardId: string) {
  const store = await getVerifiedStoreBySlug(storeslug);

  if (!store) {
    return "Store not found";
  }
  const deletCard = await db
    .delete(giftCards)
    .where(and(eq(giftCards.storeId, store.id), eq(giftCards.id, cardId)));
  return { success: true };
}
