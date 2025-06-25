// src/repositories/book.repository.ts
import { db } from '@libs/db';
import { Book } from '@prisma/client';

export const bookRepository = {
  async findByIsbn(isbn: string): Promise<Book | null> {
    return db.book.findUnique({ where: { isbn } });
  },

  async searchByTitleOrAuthor(query: string, take = 20): Promise<Book[]> {
    return db.book.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { author: { contains: query, mode: 'insensitive' } },
        ],
      },
      take,
      orderBy: { title: 'asc' },
    });
  },
};
