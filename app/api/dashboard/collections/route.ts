import { db } from "@/drizzle/db";
import { collectionProducts, collections } from "@/drizzle/schema";
import { collectionRepository } from "../../../../modules/collections-repository";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getVerifiedStoreBySlug } from "@/lib/store-utils";
import { generateSlug } from "@/modules/utils";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const storeslug = url.searchParams.get("storeslug");

    if (!storeslug) {
      return NextResponse.json(
        { error: "storeslug is required" },
        { status: 400 },
      );
    }

    const storeOwner = await getVerifiedStoreBySlug(storeslug);

    const collectionList = await collectionRepository.getAllCollection(
      db,
      storeOwner.id,
    );

    return NextResponse.json(collectionList);
  } catch (error) {
    console.error("Error fetching collections:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
export async function POST(request: Request) {
  const body = await request.json();
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
      { error: "storeslug is required" },
      { status: 400 },
    );
  }

  const storeData = await getVerifiedStoreBySlug(storeslug);
  const [newCollection] = await db
    .insert(collections)
    .values({
      storeId: storeData.id,
      name: name,
      description: description || null,
      slug: generateSlug(name),
      type: type || "manual",
      publishedScope: publishedScope || "online",
      image: image || null,
    })
    .returning();

  if (productIds && productIds.length > 0) {
    await db.insert(collectionProducts).values(
      productIds.map((productId: string) => ({
        collectionId: newCollection.id,
        productId: productId,
      })),
    );
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
