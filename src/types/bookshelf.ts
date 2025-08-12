// src/types/bookshelf.ts
import type { ReadingStatus } from '@/types/index';
import type { MinimalBook } from '@/types/book';

export interface ShelfItem {
  userId: string;
  bookIsbn: string;
  status: ReadingStatus;
  isPrivate: boolean;
  addedAt: Date;
  updatedAt: Date;
  removedAt?: Date;
  currentPage?: number;
  rating?: number;
  // opcional: dados do livro para evitar fetch por ISBN no cliente
  book?: MinimalBook;
}
