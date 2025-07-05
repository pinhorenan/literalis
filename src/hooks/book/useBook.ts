// src/hooks/book/useBook.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchBookData } from '@/api/books';
import type { Book } from '@/types/book';

export function useBook(isbn: string) {
  return useQuery<Book>({
    queryKey: ['book', isbn],
    queryFn: () => fetchBookData(isbn),
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
}
