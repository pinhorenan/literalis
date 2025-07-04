// src/hooks/book/useAllBooks.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchAllBooks } from '@/api/books';
import type { BookDataResponse } from '@/api/books';

export function useAllBooks() {
  return useQuery<BookDataResponse[]>({
    queryKey: ['books', 'all'],
    queryFn: () => fetchAllBooks(),
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
