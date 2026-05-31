import { z } from "zod";
import { CreateProductSchema } from "./types";
import { productRepository } from "./product-repository";
import { generateSlug } from "./utils";
export async function createProductWithAllData(
  db: any,
  productData: z.infer<typeof CreateProductSchema>,
  storeId: string,
) {
  // 1. Create product with storeId from session
  const product = await productRepository.createProduct(db, {
    storeId: storeId, // Use storeId from session
    name: productData.name,
    description: productData.description,
    categoryId: productData.categoryId,
    slug: generateSlug(productData.name),
    status: productData.status || "draft",
    vendor: productData.vendor,
    productType: productData.productType,
  });

  // 2. Create images
  const images = await productRepository.createImages(
    db,
    productData.images.map((img) => ({
      productId: product.id,
      url: img.url,
    })),
  );

  // 3. Create options and option values
  const optionValueMap = new Map(); // key: "optionName:value", value: optionValueId

  if (productData.options) {
    for (const option of productData.options) {
    const [createdOption] = await productRepository.createOptions(db, [
      {
        productId: product.id,
        name: option.name,
      },
    ]);

    const optionValues = await productRepository.createOptionValues(
      db,
      option.values.map((value) => ({
        optionId: createdOption.id,
        value: value,
      })),
    );

    // Store mapping
    option.values.forEach((value, idx) => {
      optionValueMap.set(
        `${createdOption.name}:${value}`,
        optionValues[idx].id,
      );
    });
  }
  }

  // 4. Create variants and link option values
  if (productData.variants) {
    for (const variant of productData.variants) {
    let imageId = null;
    if (variant.imageIndex !== undefined && images[variant.imageIndex]) {
      imageId = images[variant.imageIndex].id;
    }

    const [createdVariant] = await productRepository.createVarients(db, [
      {
        productId: product.id,
        name: variant.name,
        sku: variant.sku,
        barcode: variant.barcode,
        price: variant.price.toString(),
        inventoryQuantity: variant.inventoryQuantity,
        weight: variant.weight,
        weightUnit: variant.weightUnit,
        imageId: imageId,
      },
    ]);

    // Link variant to option values
    const variantLinks = [];
    if (productData.options) {
      for (let i = 0; i < productData.options.length; i++) {
        const option = productData.options[i];
        const optionValue = variant.optionValues[i];
        const optionValueId = optionValueMap.get(`${option.name}:${optionValue}`);

        if (optionValueId) {
          variantLinks.push({
            variantId: createdVariant.id,
            optionValueId: optionValueId,
          });
        }
      }
    }

    if (variantLinks.length > 0) {
      await productRepository.createVarientLinks(db, variantLinks);
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
