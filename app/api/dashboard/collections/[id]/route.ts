import { db } from "@/drizzle/db";
import { collectionProducts, collections } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getVerifiedStoreBySlug } from "@/lib/store-utils";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { message: "Collection ID is required" },
      { status: 400 },
    );
  }
  const body = await req.json();
  const {
    storeslug,
    name,
    description,
    type,
    publishedScope,
    image,
    productIds,
  } = body;
  if (!storeslug) {
    return NextResponse.json(
      { message: "storeslug is required" },
      { status: 400 },
    );
  }

  const storeOwner = await getVerifiedStoreBySlug(storeslug);
  const update = await db
    .update(collections)
    .set({
      storeId: storeOwner.id,
      name,
      description,
      type,
      publishedScope,
      image,
    })
    .where(and(eq(collections.id, id), eq(collections.storeId, storeOwner.id)))
    .returning();

  // Update collection products
  if (productIds) {
    // Remove all existing relations
    await db
      .delete(collectionProducts)
      .where(eq(collectionProducts.collectionId, id));

    // Add new relations
    if (Array.isArray(productIds) && productIds.length > 0) {
      await db.insert(collectionProducts).values(
        productIds.map((productId: string) => ({
          collectionId: id,
          productId,
        })),
      );
    }
  }
  const completeCollection = await db.query.collections.findFirst({
    where: eq(collections.id, id),
    with: {
      collectionProducts: {
        with: {
          product: true,
        },
      },
    },
  });
  return NextResponse.json(completeCollection, { status: 200 });
}
