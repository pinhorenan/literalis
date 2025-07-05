// src/hooks/book/useAllBooks.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchAllBooks } from '@/api/books';
import type { MinimalBook } from '@/types/book';

export function useAllBooks() {
  return useQuery<MinimalBook[]>({
    queryKey: ['books', 'all'],
    queryFn: () => fetchAllBooks(),
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
}
