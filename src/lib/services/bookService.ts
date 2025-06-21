// File: src/lib/services/bookService.ts
import type { BookDTO } from '@models/book.dto';
import { findBookByIsbn } from '@repository/book';

export async function getBook(isbn: string): Promise<BookDTO | null> {
  const book = await findBookByIsbn(isbn);
  if (!book) return null;

  return {
    isbn:             book.isbn,
    title:            book.title,
    author:           book.author,
    coverUrl:         book.coverUrl,
    publisher:        book.publisher ?? undefined,
    edition:          book.edition  ?? undefined,
    pages:            book.pages    ?? undefined,
    language:         book.language ?? undefined,
    publicationDate:  book.publicationDate?.toISOString() ?? undefined,
    external:         book.externalSource !== 'INTERNAL',
  };
}
