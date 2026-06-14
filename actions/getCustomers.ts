"use server";
import { db } from "@/drizzle/db";
import { customers, store } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

/**
 * Fetch customers for a store identified by its slug.
 * Verifies the authenticated user owns the store.
 */
export const getAllCustomers = async (storeslug: string) => {
  if (!storeslug) {
    throw new Error("storeslug is required");
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  // Find store by slug
  const storeOwner = await db.query.store.findFirst({
    where: eq(store.slug, storeslug),
  });

  if (!storeOwner) {
    throw new Error("Store not found");
  }

  // Verify ownership
  if (storeOwner.ownerId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const customersList = await db
    .select()
    .from(customers)
    .where(eq(customers.storeId, storeOwner.id));

  return customersList;
};
