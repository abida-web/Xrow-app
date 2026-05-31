import { z } from "zod";
export const CreateProductSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  slug: z.string(),
  status: z.string().optional(),
  vendor: z.string().optional(),
  categoryId: z.string(),
  productType: z.string().optional(),
  images: z.array(
    z.object({
      url: z.string().url(),
    }),
  ),
  options: z.array(
    z.object({
      name: z.string(),
      values: z.array(z.string()),
    }),
  ).optional(),
  variants: z.array(
    z.object({
      name: z.string(),
      sku: z.string().optional(),
      barcode: z.string().optional(),
      price: z.number(),
      inventoryQuantity: z.number().optional(),
      weight: z.string().optional().nullable(),
      weightUnit: z.string().optional(),
      imageIndex: z.number().optional(),
      optionValues: z.array(z.string()),
    }),
  ).optional(),
  tags: z.array(z.string()).optional(),
});
