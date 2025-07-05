// src/validators/bookshelf.ts
import { z } from 'zod';
import { ReadingStatusEnum } from '@/types/common';

export const ShelfItemInputSchema = z.object({
  userId: z.string().uuid(),
  bookIsbn: z.string().min(10),
  status: ReadingStatusEnum,
  isPrivate: z.boolean(),
  currentPage: z.number().int().positive().optional(),
  rating: z.number().min(0).max(5).optional(),
});

export type ShelfItemInput = z.infer<typeof ShelfItemInputSchema>;
