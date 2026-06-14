"use server";
import { db } from "@/drizzle/db";
import {
  products,
  productSalesChannels,
  salesChannels,
} from "@/drizzle/schema";
import { and, eq, inArray } from "drizzle-orm";
import { getVerifiedStoreBySlug } from "@/lib/store-utils";

export async function updateSalesChannelStatus(
  storeslug: string,
  productIds: string[],
  publish: boolean,
) {
  const storeOwner = await getVerifiedStoreBySlug(storeslug);

  // 1. Get all sales channels for this store (or just the ones you want)
  const storeChannels = await db.query.salesChannels.findMany({
    where: eq(salesChannels.storeId, storeOwner.id),
  });

  if (storeChannels.length === 0) {
    throw new Error("No sales channels found for this store");
  }

  // 2. For each product and channel, insert if not exists
  for (const productId of productIds) {
    for (const channel of storeChannels) {
      // Check if record exists
      const existing = await db.query.productSalesChannels.findFirst({
        where: and(
          eq(productSalesChannels.productId, productId),
          eq(productSalesChannels.channelId, channel.id),
        ),
      });

      // If not exists, insert it
      if (!existing) {
        await db.insert(productSalesChannels).values({
          productId: productId,
          channelId: channel.id,
          isPublished: publish,
          publishedAt: publish ? new Date() : undefined,
          unpublishedAt: !publish ? new Date() : undefined,
        });
      }
    }
  }

  // 3. Update all records (including newly created ones)
  // Get all channel IDs for this store
  const channelIds = storeChannels.map((c) => c.id);

  const updated = await db
    .update(productSalesChannels)
    .set({
      isPublished: publish,
      ...(publish
        ? { publishedAt: new Date() }
        : { unpublishedAt: new Date() }),
    })
    .where(
      and(
        inArray(productSalesChannels.productId, productIds),
        inArray(productSalesChannels.channelId, channelIds),
      ),
    )
    .returning();

  return {
    success: true,
    updatedCount: updated.length,
    message: `${updated.length} product-channel relationships ${publish ? "published" : "unpublished"}`,
  };
}
