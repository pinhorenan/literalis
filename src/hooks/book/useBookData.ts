// src/hoooks/useBookData.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchBookData, BookDataResponse } from '@/api/books';

export function useBookData(isbn: string) {
  return useQuery<BookDataResponse>({
    queryKey: ['book', isbn],
    queryFn: () => fetchBookData(isbn),
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
