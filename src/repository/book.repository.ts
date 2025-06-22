// src/repository/book.repository.ts
import { db } from '@lib/db';
import { bookSelect } from '@includes/book.include';
import type { CreateBookDTO, UpdateBookDTO } from '@models/book.dto';

export const BookRepository = {
  findByIsbn: (isbn: string) => {
    return db.book.findUnique({
      where: { isbn },
      select: bookSelect,
    });
  },

  searchByTitleOrAuthor: (
    query: string,
    limit = 10,
    skip = 0,
    orderBy: 'title' | 'author' = 'title'
  ) => {
    return db.book.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { author: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: limit,
      skip,
      orderBy: { [orderBy]: 'asc' },
      select: bookSelect,
    });
  },

  create: (data: CreateBookDTO) => {
    return db.book.create({ data });
  },

  createIfNotExists: async (data: CreateBookDTO) => {
    const existing = await db.book.findUnique({ where: { isbn: data.isbn } });
    if (existing) return existing;
    return BookRepository.create(data);
  },

  update: (isbn: string, data: UpdateBookDTO) => {
    return db.book.update({
      where: { isbn },
      data,
    });
  },

  delete: (isbn: string) => {
    return db.book.delete({
      where: { isbn },
    });
  },
};
