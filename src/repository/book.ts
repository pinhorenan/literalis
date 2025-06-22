// File: src/lib/repository/bookRepository.ts
import { db } from '@lib/db';
import { bookSelectArgs } from '@/src/includes/book';

export async function findBookByIsbn(isbn: string) {
  return db.book.findUnique({
    where: { isbn },
    ...bookSelectArgs(),
  });
}
