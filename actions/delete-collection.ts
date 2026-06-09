"use server";
import { db } from "@/drizzle/db";
import { collections, store } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { and, eq, inArray } from "drizzle-orm";
import { headers } from "next/headers";

export async function removeCollection(collectionIds: string[]) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("unauthorized");
  }
  const storeOwner = await db.query.store.findFirst({
    where: eq(store.ownerId, session.user.id),
  });
  if (!storeOwner) {
    throw new Error("store doesn't exist");
  }
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
