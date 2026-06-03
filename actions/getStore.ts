import { db } from "@/drizzle/db";
import { products, store } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

export async function getStore(storeslug: string) {
  try {
    const storeData = await db.query.store.findFirst({
      where: eq(store.slug, storeslug),
      with: {
        settings: true,
      },
    });

    if (!storeData) {
      return { error: "Store doesn't exist", status: 404 };
    }

    const dbProducts = await db.query.products.findMany({
      where: and(
        eq(products.storeId, storeData.id),
        eq(products.status, "active"),
      ),
      with: {
        images: true,
        variants: true,
      },
      limit: 20,
    });

    return { store: storeData, products: dbProducts };
  } catch (error) {
    console.error("Error fetching store:", error);
    return { error: "Failed to fetch store data", status: 500 };
  }
}
