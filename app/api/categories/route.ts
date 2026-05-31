import { db } from "@/drizzle/db";
import { adminGaurd } from "@/lib/AdminGaurd";
import { productRepository } from "@/modules/product-repository";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await adminGaurd();
  try {
    const { name } = await request.json();

    const product = productRepository.createCategory(db, name);

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error("Failed creating category:", error);

    return NextResponse.json(
      {
        error: "Failed creating category",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
