// src/lib/mappers/book.mapper.ts
import type { Book } from '@prisma/client';
import type { BookDTO } from '../../types/dto/book.dto';

export function toBookDTO(book: Book): BookDTO {
  return {
    isbn:              book.isbn,
    title:             book.title,
    author:            book.author,
    coverUrl:          book.coverUrl,
    publisher:         book.publisher ?? undefined,
    edition:           book.edition ?? undefined,
    pages:             book.pages ?? undefined,
    language:          book.language ?? undefined,
    publicationDate:   book.publicationDate ? book.publicationDate.toISOString() : undefined,
    external:          book.externalSource && book.externalSource !== 'INTERNAL' ? true : false,
  };
}
