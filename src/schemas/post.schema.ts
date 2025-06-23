import { z } from 'zod';

export const postCreateSchema = z.object({
  content: z.string().min(1),
  bookIsbn: z.string().min(1),
  currentPage: z.number().int().min(0),
  rating: z.number().int().min(1).max(5).optional(),
});
export type PostCreateDTO = z.infer<typeof postCreateSchema>;

export const postUpdateSchema = z.object({
  content: z.string().min(1).optional(),
  currentPage: z.number().int().min(0).optional(),
  rating: z.number().int().min(1).max(5).optional(),
});
export type PostUpdateDTO = z.infer<typeof postUpdateSchema>;

