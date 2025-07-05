// src/api/books.ts
import type { MinimalBook, Book } from '@/types/index';

// * GET app/api/books/[isbn]
export async function fetchBookData(isbn: string): Promise<Book> {
  const res = await fetch(`/api/books/${isbn}`);
  if (!res.ok) throw new Error('Erro ao buscar dados do livro');
  return res.json();
}

// * GET app/api/books
export async function fetchAllBooks(): Promise<MinimalBook[]> {
  const res = await fetch('/api/books');
  if (!res.ok) throw new Error('Erro ao buscar lista de livros');

  const data = await res.json();
  return data as MinimalBook[];
}
