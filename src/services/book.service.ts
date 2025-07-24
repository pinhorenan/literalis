// src/services/book.service.ts
import { prisma } from '@/lib/prisma';
import { mapBook } from '@/lib/mappings/mappers';
import { MINIMAL_BOOK_SELECT, FULL_BOOK_SELECT } from '@/lib/constants/selects';
import type { Book, MinimalBook } from '@/types/index';

export async function getBookByIsbn(isbn: string): Promise<Book | null> {
  const row = await prisma.book.findUnique({
    where: { isbn },
    select: FULL_BOOK_SELECT,
  });
  return row ? mapBook(row) : null;
}

export async function searchBookByTitle(title: string, limit = 20): Promise<MinimalBook[]> {
  const rows = await prisma.book.findMany({
    where: { title: { contains: title } },
    select: MINIMAL_BOOK_SELECT,
    take: limit,
  });
  return rows.map((b) => ({
    isbn: b.isbn,
    title: b.title,
    coverUrl: b.coverUrl,
    totalPages: b.pages,
    authors: b.authors.map((a) => a.author),
  }));
}
