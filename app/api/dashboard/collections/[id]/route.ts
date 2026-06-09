import { db } from "@/drizzle/db";
import { collectionProducts, collections, store } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const storeOwner = await db.query.store.findFirst({
    where: eq(store.ownerId, session.user.id),
  });
  if (!storeOwner) {
    return NextResponse.json({ message: "Store not found" }, { status: 404 });
  }
  const body = await req.json();
  const { name, description, type, publishedScope, image, productIds } = body;
  const update = await db
    .update(collections)
    .set({
      storeId: storeOwner?.id,
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
