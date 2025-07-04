// src/api/books.ts
import type { MinimalBook, Book } from '@/types/book';

export async function fetchBookData(isbn: string): Promise<Book> {
  const res = await fetch(`/api/books/${isbn}`);
  if (!res.ok) throw new Error('Erro ao buscar dados do livro');
  return res.json();
}

export async function fetchAllBooks(): Promise<MinimalBook[]> {
  const res = await fetch('/api/books');
  if (!res.ok) throw new Error('Erro ao buscar lista de livros');
  const dto = await res.json();
  return {
    ...dto,
    publicationDate: new Date(dto.publicationDate),
  };
}
