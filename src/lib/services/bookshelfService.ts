// File: src/lib/services/userBook.ts
import type { UserBookDTO } from '@models/userBook.dto';
import {
  findUserBook,
  findBookshelf,
} from '@repository/userBook';

function mapUB(ub: any): UserBookDTO {
  const pct =
    ub.book.pages && ub.book.pages > 0
      ? Math.min(100, Math.round((ub.progress / ub.book.pages) * 100))
      : null;

  return {
    user: ub.user,
    book: {
      ...ub.book,
      external: ub.book.externalSource !== 'INTERNAL',
    },
    progressPages: ub.progress,
    progressPct:   pct,
    addedAt:  ub.addedAt.toISOString(),
    updatedAt:ub.updatedAt.toISOString(),
    status:   ub.status,
    isPrivate: ub.isPrivate,
  };
}

export async function getUserBook(
  userUsername: string,
  bookIsbn: string,
): Promise<UserBookDTO | null> {
  const ub = await findUserBook({ userUsername, bookIsbn });
  return ub ? mapUB(ub) : null;
}

export async function getBookshelf(
  userUsername: string,
): Promise<UserBookDTO[]> {
  const list = await findBookshelf(userUsername);
  return list.map(mapUB);
}
