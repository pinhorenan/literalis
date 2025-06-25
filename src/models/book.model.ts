// src/models/book.model.ts
import { Book } from '@prisma/client';
import { z } from 'zod';

export const bookCreateSchema = z.object({
  isbn: z.string().length(13), // ISBN-13
  title: z.string().max(200), // Limite bom senso.
  pages: z.number().int().positive().max(10000), // Limite bom senso.
  author: z.string().max(100).default('Autor desconhecido'), // Limite bom senso.
  edition: z.number().int().positive().default(1), // Edição padrão 1
  language: z.string().max(50).default('Idioma desconhecido.'),
  coverUrl: z.string().url().default('/uploads/covers/default-cover.jpg'), // URL padrão para capa
  publisher: z.string().max(100).default('Editora desconhecida.'), // Editora padrão
  publicationDate: z.date().default(() => new Date()), // Data atual por padrão
  external: z.boolean().default(false),
});
export type BookCreateDTO = z.infer<typeof bookCreateSchema>;

export interface MinimalBookDTO {
  isbn: string;
  title: string;
  pages: number;
  coverUrl: string;
}

export interface BookDTO extends MinimalBookDTO {
  author: string;
  publisher: string;
  edition: number;
  language: string;
  publicationDate: Date;
  external: boolean;
}

export function mapBookToMinimalDTO(book: Book): MinimalBookDTO {
  return {
    isbn: book.isbn,
    title: book.title,
    pages: book.pages,
    coverUrl: book.coverUrl,
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
