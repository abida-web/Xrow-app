// app/api/dashboard/product/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { z } from "zod";
import { store } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { CreateProductSchema } from "@/modules/types";
import { createProductWithAllData } from "@/modules/product-create";

export async function POST(request: NextRequest) {
  try {
    // Get the session
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user's store
    const userStore = await db.query.store.findFirst({
      where: eq(store.ownerId, session.user.id),
    });

    if (!userStore) {
      return NextResponse.json(
        { error: "No store found for this user" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const validatedData = CreateProductSchema.parse(body);

    const product = await createProductWithAllData(
      db,
      validatedData,
      userStore.id,
    );

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error("Failed creating product:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues, // FIXED: changed from 'errors' to 'issues'
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: "Failed creating product",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
