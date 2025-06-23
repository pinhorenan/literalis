// src/hooks/book/useBookSearch.ts
'use client';

import useSWR from 'swr';
import { BookClient } from '@services/client/book.client';

type UseBookSearchOptions = {
  limit?: number;
  skip?: number;
  orderBy?: 'title' | 'author';
};

export default function useBookSearch(query: string, options?: UseBookSearchOptions) {
  const { limit = 10, skip = 0, orderBy = 'title' } = options || {};

  const shouldFetch = query.length > 0;

  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? ['/api/books', query, limit, skip, orderBy] : null,
    () => BookClient.search(query, limit, skip, orderBy)
  );

  return {
    books: data,
    isLoading,
    error,
    mutate,
  };
}
