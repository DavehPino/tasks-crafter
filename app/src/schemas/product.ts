import { z } from 'zod';

export const productRatingSchema = z.object({
  rate: z.number(),
  count: z.number(),
});

export const productSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  description: z.string(),
  category: z.string(),
  image: z.string(),
  rating: productRatingSchema,
});

export type Product = z.infer<typeof productSchema>;
