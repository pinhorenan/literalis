import { z } from 'zod';
import { ReadingStatus } from '@prisma/client';

export const bookshelfEntryCreateSchema = z.object({
  bookIsbn: z.string().min(1),
  currentPage: z.number().int().min(0),
  totalPages: z.number().int().min(1),
  status: z.nativeEnum(ReadingStatus).optional(),
  isPrivate: z.boolean().optional(),
  rating: z.number().int().min(1).max(5).optional(),
});
export type BookshelfEntryCreateDTO = z.infer<typeof bookshelfEntryCreateSchema>;

export const bookshelfEntryUpdateSchema = z.object({
  currentPage: z.number().int().min(0).optional(),
  totalPages: z.number().int().min(1).optional(),
  status: z.nativeEnum(ReadingStatus).optional(),
  isPrivate: z.boolean().optional(),
  rating: z.number().int().min(1).max(5).optional(),
});
export type BookshelfEntryUpdateDTO = z.infer<typeof bookshelfEntryUpdateSchema>;