import { minimalBookSelect } from '@lib/api/book.include';

export const bookshelfEntrySelect = {
  ownerUsername: true,
  currentPage: true,
  status: true,
  isPrivate: true,
  addedAt: true,
  updatedAt: true,
  removedAt: true,
  rating: true,
  book: { select: minimalBookSelect },
} as const;
