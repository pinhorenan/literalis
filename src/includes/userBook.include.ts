// src/includes/userBook.include.ts
import { bookSelect } from './book.include';
import { fullUserSelect } from './user.include';

export const userBookInclude = {
    user: { select: fullUserSelect },
    book: { select: bookSelect },
} as const;

export const userBookOptionSelect = {
  currentPage: true,
  isPrivate: true,
  book: {
    select: {
      isbn: true,
      title: true,
      coverUrl: true,
      pages: true,
    },
  },
} as const;

