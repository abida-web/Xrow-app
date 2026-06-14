// modules/types.ts
import { z } from "zod";

export const CreateProductSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  status: z.string().optional(),
  vendor: z.string().optional(),
  categoryId: z.string(),
  productType: z.string().optional(),

  option1Name: z.string().optional(),
  option2Name: z.string().optional(),
  option3Name: z.string().optional(),

  images: z.array(
    z.object({
      url: z.string().url(),
    }),
  ),

  variants: z
    .array(
      z.object({
        title: z.string(),
        option1Value: z.string().optional(),
        option2Value: z.string().optional(),
        option3Value: z.string().optional(),
        sku: z.string().optional(),
        barcode: z.string().optional(),
        price: z.number(),
        compareAtPrice: z.number().optional(),
        inventoryQuantity: z.number().optional(),
        weight: z.number().optional().nullable(),
        weightUnit: z.string().optional(),
        imageIndex: z.number().optional(),
        locationId: z.string().optional(),
        inventoryLevels: z
          .array(
            z.object({
              locationId: z.string(), // ADD THIS - was missing!
              available: z.number().optional().default(0),
              onHand: z.number().optional().default(0),
              incoming: z.number().optional().default(0),
              committed: z.number().optional().default(0),
            }),
          )
          .optional(),
      }),
    )
    .optional(),

  tags: z.array(z.string()).optional(),
});
