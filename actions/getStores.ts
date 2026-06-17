"use server";
import { db } from "@/drizzle/db";
import { locations, store } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export const getAllLocations = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const shopOwner = await db.query.store.findFirst({
    where: eq(store.ownerId, session.user.id),
  });

  if (!shopOwner?.id) {
    throw new Error("Store not found");
  }
  const locationsList = await db.query.locations.findMany({
    where: eq(locations.storeId, shopOwner.id),
  });
  return locationsList;
};
