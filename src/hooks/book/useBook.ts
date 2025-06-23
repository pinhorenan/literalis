// src/hooks/book/useBook.ts
'use client';

import useSWR from 'swr';
import { BookClient } from '@services/client/book.client';

export function useBook(isbn?: string) {
  const shouldFetch = Boolean(isbn);
  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? `/api/books/${isbn}` : null,
    () => BookClient.getByIsbn(isbn!)
  );

  return {
    book: data,
    isLoading,
    error,
    mutate,
  };
}
