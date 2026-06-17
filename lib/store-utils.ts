import { db } from "@/drizzle/db";
import { store } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function getVerifiedStoreBySlug(storeslug: string) {
  if (!storeslug) {
    throw new Error("storeslug is required");
  }

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || !session.user?.id) {
    throw new Error("Unauthorized");
  }

  const storeOwner = await db.query.store.findFirst({
    where: eq(store.slug, storeslug),
  });

  if (!storeOwner) {
    throw new Error("Store not found");
  }

  if (storeOwner.ownerId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  return storeOwner;
}
