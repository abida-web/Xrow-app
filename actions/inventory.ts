"use server";

import { db } from "@/drizzle/db";
import {
  inventoryLevels,
  locations,
  productVariants,
  products,
} from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { getVerifiedStoreBySlug } from "@/lib/store-utils";

export const getInventory = async (storeslug: string) => {
  try {
    const storeOwner = await getVerifiedStoreBySlug(storeslug);
    const location = await db.query.locations.findFirst({
      where: eq(locations.storeId, storeOwner.id),
    });

    if (!location) {
      return [];
    }

    // Get inventory with location information
    const inventory = await db
      .select({
        id: productVariants.id,
        name: productVariants.title,
        sku: productVariants.sku,
        price: productVariants.price,
        productId: productVariants.productId,
        productName: products.name,
        locationId: locations.id,
        available: inventoryLevels.available,
        comming: inventoryLevels.incoming,
        commited: inventoryLevels.committed,
        onHand: inventoryLevels.onHand,
        locationName: locations.name, // Added location name
      })
      .from(inventoryLevels)
      .innerJoin(
        productVariants,
        eq(inventoryLevels.variantId, productVariants.id),
      )
      .innerJoin(products, eq(productVariants.productId, products.id))
      .leftJoin(locations, eq(inventoryLevels.locationId, locations.id))
      .where(eq(products.storeId, storeOwner.id))
      .orderBy(productVariants.title, locations.name);

    return inventory;
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return [];
  }
};
