"use server";
import { db } from "@/drizzle/db";
import { catalogs, store } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { ca } from "zod/v4/locales";

export const getAllCatalogs = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("unauthorized");
  }
  const storeOwner = await db.query.store.findFirst({
    where: eq(store.ownerId, session?.user.id),
  });
  if (!storeOwner) {
    throw new Error("Store not existed");
  }
  const catalogsList = await db.query.catalogs.findMany({
    where: eq(catalogs.storeId, storeOwner?.id),
    with: {
      catalogProducts: true,
    },
  });
  return catalogsList;
};
