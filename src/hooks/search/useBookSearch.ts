// src/hooks/search/useBookSearch.ts
'use client';

import useSWR from 'swr';
import { fetcher } from '@lib/fetcher';
import type { BookDTO } from '@models/book.dto';

export default function useBookSearch(query: string) {
  const shouldFetch = query.trim().length > 0;

  const { data, error, isLoading } = useSWR<BookDTO[]>(
    shouldFetch ? `/api/search/books?q=${encodeURIComponent(query)}` : null,
    fetcher
  );

  return {
    books: data ?? [],
    isLoading,
    error,
  };
}
