// src/hooks/bookshelf/useUpsertShelfItem.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { upsertShelfItemClient } from '@/src/api/bookshelf';
import type { ShelfItem } from '@/types/bookshelf';

/**
 * Hook para criar ou atualizar (upsert) um item na estante.
 */
export function useUpsertShelfItem(username: string) {
  const qc = useQueryClient();
  return useMutation<
    ShelfItem, // TData
    Error, // TError
    Omit<ShelfItem, 'addedAt' | 'updatedAt' | 'removedAt'> // TVariables
  >({
    mutationFn: (item) => upsertShelfItemClient(username, item),
    onSuccess: (newItem) => {
      qc.invalidateQueries({ queryKey: ['shelf', username] });
      qc.invalidateQueries({ queryKey: ['shelf', username, newItem.bookIsbn] });
    },
  });
}
