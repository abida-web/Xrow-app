import { db } from "@/drizzle/db";
import { store, storeMembers, user } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  const { name, slug, shopDomain, logoUrl, businessType, currency } =
    await req.json();
  const [newStore] = await db
    .insert(store)
    .values({
      name,
      slug,
      ownerId: session?.user.id,
      shopDomain,
      logoUrl,
      businessType,
      currency,
    })
    .returning();
  await db.insert(storeMembers).values({
    storeId: newStore.id,
    userId: session?.user.id,
    role: "owner",
  });
  return NextResponse.json({ success: true }, { status: 201 });
}
