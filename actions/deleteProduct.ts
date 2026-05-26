import { db } from "@/drizzle/db";
import { products, store } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function deleteProduct(productId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shopOwner = await db.query.store.findFirst({
      where: eq(store.ownerId, session.user.id),
    });

    if (!shopOwner?.id) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    await db
      .delete(products)
      .where(
        and(eq(products.storeId, shopOwner.id), eq(products.id, productId)),
      );

    return NextResponse.json(
      { success: true, message: "Product deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
