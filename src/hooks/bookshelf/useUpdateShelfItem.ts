// src/hooks/bookshelf/useUpdateShelfItem.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateShelfItemClient } from '@/src/api/bookshelf';
import type { ShelfItem } from '@/types/bookshelf';

/**
 * Hook opcional para atualização explícita (PUT) de um ISBN específico.
 */
export function useUpdateShelfItem(username: string, isbn: string) {
  const qc = useQueryClient();
  return useMutation<
    ShelfItem,
    Error,
    Omit<ShelfItem, 'userId' | 'bookIsbn' | 'addedAt' | 'updatedAt' | 'removedAt'>
  >({
    mutationFn: (data) => updateShelfItemClient(username, isbn, data),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ['shelf', username] });
      qc.invalidateQueries({ queryKey: ['shelf', username, isbn] });
    },
  });
}
