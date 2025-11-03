import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(255, 'Product name is too long'),
  description: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  price: z.number().min(0, 'Price must be a positive number'),
  cost: z.number().min(0, 'Cost must be a positive number'),
  stock: z.number().int().min(0, 'Stock must be a non-negative integer'),
  minStock: z.number().int().min(0, 'Minimum stock must be a non-negative integer'),
  maxStock: z.number().int().min(0, 'Maximum stock must be a non-negative integer'),
  isActive: z.boolean().optional(),
  categoryId: z.string().optional(),
  imageUrl: z.string().optional(),
});

export const productUpdateSchema = productSchema.partial();

export type ProductInput = z.infer<typeof productSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;