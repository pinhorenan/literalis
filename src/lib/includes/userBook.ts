// File: src/lib/includes/userBook.ts
import type { db } from '@prisma/client';
import { publicUserSelect } from '@includes/user';
import { publicBookSelect } from '@includes/book';

export function userBookInclude(): { select: db.userBookSelect } {
  return {
    select: {
      progress:   true,
      addedAt:    true,
      updatedAt:  true,
      status:     true,
      isPrivate:  true,

      user: { select: publicUserSelect },
      book: { select: publicBookSelect },
    },
  };
}
