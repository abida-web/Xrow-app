import { db } from "@/drizzle/db";
import { products, store } from "@/drizzle/schema";
import { and, eq, ilike, or, SQL } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeslug: string }> }, // params is a Promise
) {
  try {
    const { storeslug } = await params; // AWAIT the params

    // Get store by slug
    const storeData = await db.query.store.findFirst({
      where: eq(store.slug, storeslug),
    });

    if (!storeData) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const vendor = searchParams.get("vendor") || "";
    const productType = searchParams.get("productType") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 20;
    const offset = (page - 1) * limit;

    const filters: SQL<unknown>[] = [eq(products.storeId, storeData.id)];

    if (search) {
      filters.push(
        or(
          ilike(products.name, `%${search}%`),
          ilike(products.vendor, `%${search}%`),
          ilike(products.productType, `%${search}%`),
        ),
      );
    }
    if (status && status !== "all") {
      filters.push(eq(products.status, status));
    }
    if (vendor) {
      filters.push(eq(products.vendor, vendor));
    }
    if (productType) {
      filters.push(eq(products.productType, productType));
    }

    const data = await db.query.products.findMany({
      where: filters.length ? and(...filters) : undefined,
      with: {
        category: true,
        images: true,
      },
      limit,
      offset,
    });

    return NextResponse.json({ products: data });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
