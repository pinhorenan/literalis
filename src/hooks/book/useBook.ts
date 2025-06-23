// src/hooks/book/useBook.ts
'use client';

import useSWR from 'swr';
import { BookClient } from '@services/client/book.client';
import type { BookDTO } from '@models/book.dto';

export function useBook(isbn?: string) {
  const shouldFetch = Boolean(isbn);

  const { data, error, isLoading, mutate } = useSWR<BookDTO>(
    shouldFetch ? `/api/books/${isbn}` : null,
    () => BookClient.getByIsbn(isbn!)
  );

  return {
    book: data,
    isLoading,
    error,
    refresh: mutate,
  };
}
