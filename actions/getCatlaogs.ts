"use server";
import { db } from "@/drizzle/db";
import { catalogs } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { getVerifiedStoreBySlug } from "@/lib/store-utils";
import { ca } from "zod/v4/locales";

export const getAllCatalogs = async (storeslug: string) => {
  const storeOwner = await getVerifiedStoreBySlug(storeslug);
  const catalogsList = await db.query.catalogs.findMany({
    where: eq(catalogs.storeId, storeOwner.id),
    with: {
      catalogProducts: true,
    },
  });
  return catalogsList;
};
