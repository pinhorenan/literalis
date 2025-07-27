// src/types/bookshelf.ts
import type { ReadingStatus } from '@/types/index';

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
}
