// src/hooks/useBooksCount.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchBooksCount, BooksCountResponse } from '@/src/data/api/users';

export function useBooksCount(username: string) {
  return useQuery<BooksCountResponse>({
    queryKey: ['booksCount', username],
    queryFn: () => fetchBooksCount(username),
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
