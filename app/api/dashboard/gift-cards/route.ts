import { db } from "@/drizzle/db";
import { customers, giftCards, store } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { hashGiftCardCode } from "@/lib/utils";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { giftFormData, customerForm, storeslug } = body;

    // Get store by slug instead of ownerId
    const storeOwner = await db.query.store.findFirst({
      where: eq(store.slug, storeslug),
    });

    if (!storeOwner) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    // Verify the store belongs to the authenticated user
    if (storeOwner.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract values from giftFormData
    const { code, initialValue, currency, note, expiresOn, currentBalance } =
      giftFormData;

    // Validate code exists
    if (!code) {
      return NextResponse.json(
        { error: "Gift card code is required" },
        { status: 400 },
      );
    }

    let finalCustomerId = null;

    // Insert new customer if customerForm has email
    if (customerForm && customerForm.email) {
      const [newCustomer] = await db
        .insert(customers)
        .values({
          email: customerForm.email,
          phone: customerForm.phone || null,
          firstName: customerForm.firstName || null,
          lastName: customerForm.lastName || null,
          subscribe: false,
          note: null,
          storeId: storeOwner.id,
        })
        .returning({ id: customers.id });

      finalCustomerId = newCustomer.id;
    }

    // Hash the gift card code
    const hashed = hashGiftCardCode(code);

    // Create gift card
    const newGiftCard = await db
      .insert(giftCards)
      .values({
        code: code,
        codeHash: hashed,
        initialValue: initialValue,
        balance: currentBalance || initialValue,
        currency: currency,
        storeId: storeOwner.id,
        enabled: true,
        customerId: finalCustomerId,
        expiresOn: expiresOn ? new Date(expiresOn) : null,
        note: note ?? null,
      })
      .returning();

    return NextResponse.json(
      { success: true, giftCard: newGiftCard[0] },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating gift card:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
