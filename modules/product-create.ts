// modules/product-create.ts
import { z } from "zod";
import { CreateProductSchema } from "./types";
import { productRepository } from "./product-repository";
import { generateSlug, generateTitle } from "./utils";
import { eq } from "drizzle-orm";
import { locations } from "@/drizzle/schema";

export async function createProductWithAllData(
  db: any,
  productData: z.infer<typeof CreateProductSchema>,
  storeId: string,
  isInventoryTracked: boolean,
) {
  // 1. Get store locations (or create default if none exist)
  let storeLocations = await productRepository.getStoreLocations(db, storeId);

  if (storeLocations.length === 0) {
    // Create default location if none exists
    const [defaultLocation] = await db
      .insert(locations)
      .values({
        storeId: storeId,
        name: "Main Warehouse",
        isActive: true,
        isDefault: true,
      })
      .returning();
    storeLocations = [defaultLocation];
  }

  // 2. Create product with Shopify-style options
  const product = await productRepository.createProduct(db, {
    storeId: storeId,
    name: productData.name,
    description: productData.description,
    categoryId: productData.categoryId,
    slug: generateSlug(productData.name),
    status: productData.status || "draft",
    vendor: productData.vendor,
    productType: productData.productType,
    option1Name: productData.option1Name,
    option2Name: productData.option2Name,
    option3Name: productData.option3Name,
  });

  // 3. Create images
  const images = await productRepository.createImages(
    db,
    productData.images.map((img) => ({
      productId: product.id,
      url: img.url,
    })),
  );

  // 4. Create variants AND inventory levels for each location
  if (productData.variants && productData.variants.length > 0) {
    const variantsWithProductId = productData.variants.map((variant, index) => {
      let imageId = null;
      if (variant.imageIndex !== undefined && images[variant.imageIndex]) {
        imageId = images[variant.imageIndex].id;
      }
      let variantLocationId = null;
      if (variant.locationId) {
        variantLocationId = variant.locationId;
      } else if (storeLocations.length > 0) {
        variantLocationId = storeLocations[0].id;
      }

      return {
        productId: product.id,
        option1Value: variant.option1Value || null,
        option2Value: variant.option2Value || null,
        option3Value: variant.option3Value || null,
        title:
          variant.title ||
          generateTitle(
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
        locationId: variantLocationId,
      };
    });

    // Create variants
    const createdVariants = await productRepository.createVariants(
      db,
      variantsWithProductId,
    );

    // Create inventory levels for each variant at each location
    // Create inventory levels for each variant at each location
    // In product-create.ts, update the inventory levels creation:
    if (isInventoryTracked) {
      const inventoryLevelsData = [];

      for (const variant of createdVariants) {
        const variantData = productData.variants.find(
          (v) =>
            v.sku === variant.sku ||
            (v.option1Value === variant.option1Value &&
              v.option2Value === variant.option2Value),
        );

        if (
          variantData?.inventoryLevels &&
          variantData.inventoryLevels.length > 0
        ) {
          // Use the per-location inventory levels from the variant
          for (const level of variantData.inventoryLevels) {
            inventoryLevelsData.push({
              variantId: variant.id,
              locationId: variant.locationId,
              available: level.available || 0,
              onHand: level.onHand || 0,
              incoming: level.incoming || 0,
              committed: level.committed || 0,
            });
          }
        } else {
          // Default: create inventory levels for all locations with quantity 0
          for (const location of storeLocations) {
            inventoryLevelsData.push({
              variantId: variant.id,
              locationId: location.id,
              available: 0,
              onHand: 0,
              incoming: 0,
              committed: 0,
            });
          }
        }
      }

      if (inventoryLevelsData.length > 0) {
        await productRepository.createInventoryLevels(db, inventoryLevelsData);
      }
    }
  }

  // 5. Create tags
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
