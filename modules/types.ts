import { z } from "zod";

export const CreateProductSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  status: z.string().optional(),
  vendor: z.string().optional(),
  categoryId: z.string(),
  productType: z.string().optional(),

  // Shopify-style: Option names at product level (max 3)
  option1Name: z.string().optional(),
  option2Name: z.string().optional(),
  option3Name: z.string().optional(),

  images: z.array(
    z.object({
      url: z.string().url(),
    }),
  ),

  // Simplified variants with direct option values
  variants: z
    .array(
      z.object({
        title: z.string(), // e.g., "Small / Red"
        option1Value: z.string().optional(),
        option2Value: z.string().optional(),
        option3Value: z.string().optional(),
        sku: z.string().optional(),
        barcode: z.string().optional(),
        price: z.number(),
        compareAtPrice: z.number().optional(), // Sale price
        inventoryQuantity: z.number().optional(),
        weight: z.number().optional().nullable(),
        weightUnit: z.string().optional(),
        imageIndex: z.number().optional(),
      }),
    )
    .optional(),

  tags: z.array(z.string()).optional(),
});
