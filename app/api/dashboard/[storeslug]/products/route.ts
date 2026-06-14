// app/api/dashboard/[storeslug]/products/route.ts
import { db } from "@/drizzle/db";
import { products } from "@/drizzle/schema";
import { and, eq, ilike, or, SQL } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getVerifiedStoreBySlug } from "@/lib/store-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeslug: string }> },
) {
  try {
    const { storeslug } = await params;
    const storeData = await getVerifiedStoreBySlug(storeslug);

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
      const searchCondition = or(
        ilike(products.name, `%${search}%`),
        ilike(products.vendor, `%${search}%`),
        ilike(products.productType, `%${search}%`),
      );
      if (searchCondition) {
        filters.push(searchCondition);
      }
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
        variants: {
          columns: {
            inventoryQuantity: true,
            price: true,
            // Add any other variant fields you need
          },
        },
        catalogProducts: {
          with: {
            catalog: true,
          },
        },
      },
      limit,
      offset,
    });

    // Transform to match your Product type exactly
    const transformedProducts = data.map((product) => ({
      id: product.id,
      name: product.name,
      status: product.status,
      images: product.images,
      variants:
        product.variants?.map((variant) => ({
          inventoryQuantity: variant.inventoryQuantity,

          price: variant.price ?? undefined,
        })) || [],
      category: product.category ? { name: product.category.name } : undefined,
      productType: product.productType ?? undefined,
      vendor: product.vendor ?? undefined,
      createAt: product.createAt?.toISOString(),
      updatedAt: product.updatedAt?.toISOString(),
      catalogs:
        product.catalogProducts
          ?.filter((cp: any) => cp.isAtCatalog === true)
          .map((cp: any) => ({
            id: cp.catalog.id,
            name: cp.catalog.name,
            handle: cp.catalog.handle,
            type: cp.catalog.type,
          })) || [],
    }));

    return NextResponse.json({ products: transformedProducts });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
