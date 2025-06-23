import { MinimalBookDTO } from './book.dto';
import type { ReadingStatus } from '@prisma/client';

export interface BookshelfEntryDTO {
  ownerUsername: string;
  book: MinimalBookDTO;
  currentPage: number;
  totalPages: number;
  progress: number; // derived 0–100%
  status: ReadingStatus;
  isPrivate: boolean;
  addedAt: Date;
  updatedAt: Date;
  removedAt?: Date;
  rating?: number;
}
