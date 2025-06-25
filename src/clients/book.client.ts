// src/clients/bookClient.ts
import { BookDTO } from '@models/book.model';

const BOOKS_BASE = '/api/books';

/**
 * Busca livros por título ou autor.
 * GET /api/books?query=...&take=...
 */
export async function searchBooks(query: string, take = 10): Promise<BookDTO[]> {
  const params = new URLSearchParams({ query, take: String(take) });
  const res = await fetch(`${BOOKS_BASE}?${params}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Erro ao buscar livros');
  }
  return res.json();
}

/**
 * Obtém detalhes de um livro pelo ISBN.
 * GET /api/books/:isbn
 */
export async function getBookByIsbn(isbn: string): Promise<BookDTO> {
  const res = await fetch(`${BOOKS_BASE}/${encodeURIComponent(isbn)}`);
  if (res.status === 404) {
    throw new Error('Livro não encontrado');
  }
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Erro ao obter livro');
  }
  return res.json();
}
