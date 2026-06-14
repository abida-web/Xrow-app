"use server";
import { db } from "@/drizzle/db";
import { collections } from "@/drizzle/schema";
import { and, eq, inArray } from "drizzle-orm";
import { getVerifiedStoreBySlug } from "@/lib/store-utils";

export async function removeCollection(
  storeslug: string,
  collectionIds: string[],
) {
  const storeOwner = await getVerifiedStoreBySlug(storeslug);
  const dltCollection = await db
    .delete(collections)
    .where(
      and(
        inArray(collections.id, collectionIds),
        eq(collections.storeId, storeOwner.id),
      ),
    );
  return { success: true };
}
