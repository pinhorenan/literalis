// File: src/lib/includes/userBook.ts
import type { Prisma } from '@prisma/client';
import { publicUserSelect } from '@/src/includes/user.include';
import { publicBookSelect } from '@/src/includes/book';

export function userBookInclude(): { select: Prisma.UserBookSelect } {
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
