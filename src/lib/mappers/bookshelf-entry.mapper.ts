import type { BookshelfEntry, Book } from '@prisma/client';
import { BookshelfEntryDTO } from '@models/bookshelf-entry.dto';
import { mapBookToMinimalDTO } from '@mappers/book.mapper';

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
