// src/hooks/useBook.ts
import { useQuery, UseQueryOptions, useQueryClient } from '@tanstack/react-query';
import { searchBooks, getBookByIsbn } from '@clients/book.client';
import type { BookDTO } from '@models/book.model';

const QUERY_KEY_SEARCH = (query: string, take: number) => ['books', 'search', query, take] as const;
const QUERY_KEY_BOOK = (isbn: string) => ['book', isbn] as const;

/**
 * Hook para buscar lista de livros por título ou autor.
 *
 * @param query   Termo de busca (título ou autor)
 * @param take    Quantidade máxima de resultados (default 10)
 * @param options Opções do React Query (staleTime, onSuccess etc.)
 */
export function useSearchBooks(
  query: string,
  take = 10,
  options?: Omit<
    UseQueryOptions<BookDTO[], Error, BookDTO[], ReturnType<typeof QUERY_KEY_SEARCH>>,
    'queryKey' | 'queryFn'
  >,
) {
  const key = QUERY_KEY_SEARCH(query, take);
  return useQuery<BookDTO[], Error, BookDTO[], typeof key>({
    queryKey: key,
    queryFn: () => searchBooks(query, take),
    // cache por 5 minutos
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}

/**
 * Hook para obter detalhes de um livro por ISBN.
 *
 * @param isbn    ISBN do livro
 * @param options Opções do React Query
 */
export function useBookByIsbn(
  isbn: string,
  options?: Omit<
    UseQueryOptions<BookDTO, Error, BookDTO, ReturnType<typeof QUERY_KEY_BOOK>>,
    'queryKey' | 'queryFn'
  >,
) {
  const key = QUERY_KEY_BOOK(isbn);
  return useQuery<BookDTO, Error, BookDTO, typeof key>({
    queryKey: key,
    queryFn: () => getBookByIsbn(isbn),
    // mantém o cache um pouco mais longo, pois detalhes mudam menos
    staleTime: 1000 * 60 * 30,
    ...options,
  });
}
