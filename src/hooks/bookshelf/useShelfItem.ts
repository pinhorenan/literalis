// src/hooks/bookshelf/useShelfItem.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchShelfItem } from '@/api/bookshelf';
import type { ShelfItem } from '@/types/bookshelf';

export function useShelfItem(username: string, isbn: string) {
  return useQuery<ShelfItem, Error>({
    queryKey: ['shelf', username, isbn],
    queryFn: () => fetchShelfItem(username, isbn),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(username && isbn),
  });
}
