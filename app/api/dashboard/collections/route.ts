import { db } from "@/drizzle/db";
import { store } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { collectionRepository } from "../../../../modules/collections-repository";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const storeOwner = await db.query.store.findFirst({
      where: eq(store.ownerId, session.user.id),
    });

    if (!storeOwner) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

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
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 404 });
  }
  const storeData = await db.query.store.findFirst({
    where: eq(store.ownerId, session.user.id),
  });
}
