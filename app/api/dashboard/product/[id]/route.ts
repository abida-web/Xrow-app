import { db } from "@/drizzle/db";
import {
  products,
  productImages,
  productTags,
  productVariants,
} from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { getVerifiedStoreBySlug } from "@/lib/store-utils";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { storeslug } = body;

    if (!storeslug) {
      return Response.json({ error: "storeslug is required" }, { status: 400 });
    }

    const storeOwner = await getVerifiedStoreBySlug(storeslug);

    // Separate main product data from related data
    const {
      images: imageData,
      tags: tagData,
      variants: variantData,
      ...rawProductData
    } = body;

    // Clean product data - only allow specific fields
    const allowedFields = [
      "name",
      "description",
      "slug",
      "categoryId",
      "status",
      "vendor",
      "productType",
    ];

    const cleanProductData = Object.fromEntries(
      Object.entries(rawProductData).filter(
        ([key, value]) =>
          allowedFields.includes(key) && value !== undefined && value !== "",
      ),
    );

    // 1. Update main product
    if (Object.keys(cleanProductData).length > 0) {
      await db
        .update(products)
        .set(cleanProductData)
        .where(and(eq(products.id, id), eq(products.storeId, storeOwner.id)));
    }

    // 2. Update tags
    if (tagData && Array.isArray(tagData)) {
      await db.delete(productTags).where(eq(productTags.productId, id));

      if (tagData.length > 0) {
        await db.insert(productTags).values(
          tagData.map((t) => ({
            tag: typeof t === "string" ? t : t.tag,
            productId: id,
          })),
        );
      }
    }

    // 3. Update variants
    if (variantData && Array.isArray(variantData)) {
      await db.delete(productVariants).where(eq(productVariants.productId, id));

      if (variantData.length > 0) {
        await db.insert(productVariants).values(
          variantData.map((variant) => ({
            ...variant,
            productId: id,
          })),
        );
      }
    }

    // 4. Update images
    if (imageData && Array.isArray(imageData)) {
      // Remove image references from variants
      await db
        .update(productVariants)
        .set({ imageId: null })
        .where(eq(productVariants.productId, id));

      // Delete old images
      await db.delete(productImages).where(eq(productImages.productId, id));

      // Insert new images
      if (imageData.length > 0) {
        await db.insert(productImages).values(
          imageData.map((img) => ({
            url: img.url,
            productId: id,
          })),
        );
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("❌ PATCH Error:", error);
    return Response.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}
