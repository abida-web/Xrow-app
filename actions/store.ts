"use server";
import { db } from "@/drizzle/db";
import { store as storeSchema } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function getCurrentStore() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    return null;
  }

  return await db.query.store.findFirst({
    where: eq(storeSchema.ownerId, session.user.id),
  });
}
