// src/models/bookshelf-entry.model.ts
import { Book, BookshelfEntry, ReadingStatus } from '@prisma/client';
import { BookDTO, mapBookToDTO } from './book.model';

export interface BookshelfEntryDTO {
  ownerUsername: string;
  book: BookDTO;
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

export function mapEntryToDTO(entry: BookshelfEntry, book: Book): BookshelfEntryDTO {
  const totalPages = book.pages;
  const progress = (entry.currentPage / totalPages) * 100;

  return {
    ownerUsername: entry.ownerUsername,
    book: mapBookToDTO(book),
    currentPage: entry.currentPage,
    totalPages,
    progress,
    status: entry.status,
    isPrivate: entry.isPrivate,
    addedAt: entry.addedAt,
    updatedAt: entry.updatedAt,
    removedAt: entry.removedAt ?? undefined,
    rating: entry.rating ?? undefined,
  };
}
