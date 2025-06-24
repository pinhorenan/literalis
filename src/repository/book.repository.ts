import { db } from '@lib/db';
import { minimalBookSelect, fullBookSelect } from '@includes/book.include';

export const BookRepository = {
  find(isbn: string) {
    return db.book.findUnique({ where: { isbn }, select: fullBookSelect });
  },

  /** Autocomplete – BOOK-002 */
  search(term: string, limit = 10) {
    return db.book.findMany({
      where: {
        OR: [
          { isbn:   { contains: term, mode: 'insensitive' } },
          { title:  { contains: term, mode: 'insensitive' } },
          { author: { contains: term, mode: 'insensitive' } },
        ],
      },
      take: limit,
      select: minimalBookSelect,
      orderBy: { title: 'asc' },
    });
  },

  /** Lista completa paginada (admin / seed) */
  list(skip = 0, take = 50) {
    return db.book.findMany({ skip, take, select: fullBookSelect });
  },
};
