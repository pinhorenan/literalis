// src/services/book.service.ts
import { prisma } from '@/lib/prisma';
import type { Book, MinimalBook, MinimalAuthor, MinimalGenre } from '@/types/book';

const bookSelect = {
  isbn: true,
  title: true,
  pages: true,
  language: true,
  coverUrl: true,
  publicationDate: true,
  rating: true,
  publisher: { select: { id: true, name: true } },
  authors: { select: { author: { select: { id: true, name: true } } } },
  genres: { select: { genre: { select: { id: true, name: true } } } },
} as const;

/* ---- helpers ---- */
function mapBook(b: any): Book {
  return {
    isbn: b.isbn,
    title: b.title,
    totalPages: b.pages,
    language: b.language,
    coverUrl: b.coverUrl,
    publicationDate: b.publicationDate,
    averageRating: b.rating ?? undefined,
    ratingsCount: undefined,
    publisher: b.publisher,
    authors: b.authors.map((a: { author: MinimalAuthor }) => a.author),
    genres: b.genres.map((g: { genre: MinimalGenre }) => g.genre),
  };
}

/* ---- queries ---- */
export async function getBookByIsbn(isbn: string): Promise<Book | null> {
  const book = await prisma.book.findUnique({ where: { isbn }, select: bookSelect });
  return book ? mapBook(book) : null;
}

export async function searchBookByTitle(title: string, limit = 20): Promise<MinimalBook[]> {
  const books = await prisma.book.findMany({
    where: { title: { contains: title, mode: 'insensitive' } },
    select: bookSelect,
    take: limit,
  });
  return books.map(mapBook);
}
