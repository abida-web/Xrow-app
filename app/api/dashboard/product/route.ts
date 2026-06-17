// app/api/dashboard/product/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { z } from "zod";
import { productSalesChannels, salesChannels } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getVerifiedStoreBySlug } from "@/lib/store-utils";
import { CreateProductSchema } from "@/modules/types";
import { createProductWithAllData } from "@/modules/product-create";

export async function POST(request: NextRequest) {
  try {
    // Get the session
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the requested store belongs to the authenticated user

    const body = await request.json();
    const { formData, isInventoryTracked, storeslug } = body;
    if (!storeslug) {
      return NextResponse.json(
        { error: "storeslug is required" },
        { status: 400 },
      );
    }

    const storeOwner = await getVerifiedStoreBySlug(storeslug);
    const validatedData = CreateProductSchema.parse(formData);

    const product = await createProductWithAllData(
      db,
      validatedData,
      storeOwner.id,
      isInventoryTracked,
    );
    const onlineChannel = await db.query.salesChannels.findFirst({
      where: and(),
    });
    if (onlineChannel) {
      await db.insert(productSalesChannels).values({
        productId: product.id,
        channelId: onlineChannel.id,
        isPublished: true,
        publishedAt: new Date(),
      });
    }
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
