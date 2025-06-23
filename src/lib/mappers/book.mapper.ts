import type { Book } from '@prisma/client';
import { MinimalBookDTO, BookDTO } from '@models/book.dto';

export function mapBookToMinimalDTO(book: Book): MinimalBookDTO {
  return {
    isbn: book.isbn,
    title: book.title,
    coverUrl: book.coverUrl,
    pages: book.pages,
  };
}

export function mapBookToDTO(book: Book): BookDTO {
  return {
    ...mapBookToMinimalDTO(book),
    author: book.author,
    publisher: book.publisher,
    edition: book.edition,
    language: book.language,
    publicationDate: book.publicationDate,
    external: book.external,
  };
}
