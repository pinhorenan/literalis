// src/hooks/useBooksCount.ts
'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchBooksCount } from '@/api/users';
import type { BooksCount } from '@/types/user';

export function useBooksCount(username: string) {
  return useQuery<BooksCount, Error>({
    queryKey: ['booksCount', username],
    queryFn: () => fetchBooksCount(username),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
