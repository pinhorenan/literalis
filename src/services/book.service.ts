import { prisma } from '@/lib/prisma';
import { MINIMAL_BOOK_SELECT, FULL_BOOK_SELECT } from '@/lib/includes/book';
import type { Book, MinimalBook, MinimalAuthor, MinimalGenre } from '@/types/book';

/* ---------- mapper compartilhado ---------- */
export function mapBook(b: any): Book {
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
    genres: b.genres?.map?.((g: { genre: MinimalGenre }) => g.genre) ?? [],
  };
}

/* ---------- queries ---------- */
export async function getBookByIsbn(isbn: string): Promise<Book | null> {
  const row = await prisma.book.findUnique({
    where: { isbn },
    select: FULL_BOOK_SELECT,
  });
  return row ? mapBook(row) : null;
}

/** Usado em autocomplete/busca – devolve somente dados mínimos */
export async function searchBookByTitle(title: string, limit = 20): Promise<MinimalBook[]> {
  const rows = await prisma.book.findMany({
    where: { title: { contains: title, mode: 'insensitive' } },
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
