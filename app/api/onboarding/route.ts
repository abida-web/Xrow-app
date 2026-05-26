import { db } from "@/drizzle/db";
import { store, storeMembers, storeSettings, user } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
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
      activeTheme: "modern",
      status: "active",
      isPublished: false,
    })
    .returning();
  await db.insert(storeMembers).values({
    storeId: newStore.id,
    userId: session?.user.id,
    role: "owner",
  });
  await db.insert(storeSettings).values({
    storeId: newStore.id,
    theme: "modern",
    primaryColor: "#3B82F6",
    secondaryColor: "#10B981",
    heroTitle: `Welcome to ${newStore.name}!`,
    heroSubtitle: "Discover amazing products at great prices",
    heroImage: "/default-hero.jpg",
    announcementText: "Free shipping on orders over $50!",
    contactEmail: `hello@${slug}.com`,
  });
  return NextResponse.json(
    {
      success: true,
      store: newStore,
      slug: newStore.slug,
    },
    { status: 201 },
  );
}
