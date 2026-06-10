import { z } from "zod";
import { CreateProductSchema } from "./types";
import { productRepository } from "./product-repository";
import { generateSlug, generateTitle } from "./utils";

export async function createProductWithAllData(
  db: any,
  productData: z.infer<typeof CreateProductSchema>,
  storeId: string,
) {
  // 1. Create product with Shopify-style options
  const product = await productRepository.createProduct(db, {
    storeId: storeId,
    name: productData.name,
    description: productData.description,
    categoryId: productData.categoryId,
    slug: generateSlug(productData.name),
    status: productData.status || "draft",
    vendor: productData.vendor,
    productType: productData.productType,
    // Store option names at product level
    option1Name: productData.option1Name,
    option2Name: productData.option2Name,
    option3Name: productData.option3Name,
  });

  // 2. Create images
  const images = await productRepository.createImages(
    db,
    productData.images.map((img) => ({
      productId: product.id,
      url: img.url,
    })),
  );

  // 3. Create variants (with direct option values - no linking tables needed!)
  if (productData.variants && productData.variants.length > 0) {
    const variantsWithProductId = productData.variants.map((variant, index) => {
      let imageId = null;
      if (variant.imageIndex !== undefined && images[variant.imageIndex]) {
        imageId = images[variant.imageIndex].id;
      }

      return {
        productId: product.id,
        option1Value: variant.option1Value || null,
        option2Value: variant.option2Value || null,
        option3Value: variant.option3Value || null,
        title: generateTitle(
          variant.option1Value,
          variant.option2Value,
          variant.option3Value,
        ),
        sku: variant.sku,
        barcode: variant.barcode,
        price: variant.price.toString(),
        compareAtPrice: variant.compareAtPrice?.toString(),
        inventoryQuantity: variant.inventoryQuantity || 0,
        weight: variant.weight,
        weightUnit: variant.weightUnit,
        imageId: imageId,
      };
    });

    // ✅ FIXED: Actually call createVarients
    await productRepository.createVarients(db, variantsWithProductId);
  }

  // 4. Create tags
  if (productData.tags && productData.tags.length > 0) {
    await productRepository.createTags(
      db,
      productData.tags.map((tag) => ({
        productId: product.id,
        tag: tag,
      })),
    );
  }

  return product;
}
