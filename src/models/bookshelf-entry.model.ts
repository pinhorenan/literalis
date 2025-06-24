import { ReadingStatus, Book, BookshelfEntry } from '@prisma/client';
import { type MinimalBookDTO, mapBookToMinimalDTO } from '@models/book.model';
import { z } from 'zod';


export interface BookshelfEntryDTO {
  ownerUsername: string;
  book: MinimalBookDTO;
  currentPage: number;
  totalPages: number;
  progress: number;
  status: ReadingStatus;
  isPrivate: boolean;
  addedAt: Date;
  updatedAt: Date;
  removedAt?: Date;
  rating?: number;
}

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

export function mapEntryToDTO(
  entry: BookshelfEntry,
  book: Book
): BookshelfEntryDTO {
  const progress = Math.floor((entry.currentPage / book.pages) * 100);
  return {
    ownerUsername: entry.ownerUsername,
    book: mapBookToMinimalDTO(book),
    currentPage: entry.currentPage,
    totalPages: book.pages,
    progress,
    status: entry.status,
    isPrivate: entry.isPrivate,
    addedAt: entry.addedAt,
    updatedAt: entry.updatedAt,
    removedAt: entry.removedAt ?? undefined,
    rating: entry.rating ?? undefined,
  };
}
