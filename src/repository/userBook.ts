// File: src/lib/repository/userBookRepository.ts
import { db } from '@lib/db';
import { userBookInclude } from '@/src/includes/userBook';

export async function findUserBook(params: {
  userUsername: string;
  bookIsbn:     string;
}) {
  return db.userBook.findUnique({
    where: {
      userUsername_bookIsbn: params,
    },
    ...userBookInclude(),
  });
}

export async function findBookshelf(userUsername: string) {
  return db.userBook.findMany({
    where:   { userUsername },
    orderBy: { updatedAt: 'desc' },
    ...userBookInclude(),
  });
}
