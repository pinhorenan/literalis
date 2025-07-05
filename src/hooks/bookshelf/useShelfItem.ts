// src/hooks/bookshelf/useShelfItem.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchShelfItem } from '@/src/api/bookshelf';
import type { ShelfItem } from '@/types/bookshelf';

/**
 * Hook para buscar um único item da estante (público ou próprio).
 */
export function useShelfItem(username: string, isbn: string) {
  return useQuery<ShelfItem, Error>({
    queryKey: ['shelf', username, isbn], // chave incluindo ISBN
    queryFn: () => fetchShelfItem(username, isbn),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(username && isbn),
  });
}
