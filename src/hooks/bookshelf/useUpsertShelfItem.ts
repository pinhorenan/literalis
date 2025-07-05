// src/hooks/bookshelf/useUpsertShelfItem.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { upsertShelfItemClient } from '@/api/bookshelf';
import type { ShelfItem } from '@/types/bookshelf';

export function useUpsertShelfItem(username: string) {
  const qc = useQueryClient();
  return useMutation<ShelfItem, Error, Omit<ShelfItem, 'addedAt' | 'updatedAt' | 'removedAt'>>({
    mutationFn: (item) => upsertShelfItemClient(username, item),
    onSuccess: (newItem) => {
      qc.invalidateQueries({ queryKey: ['shelf', username] });
      qc.invalidateQueries({ queryKey: ['shelf', username, newItem.bookIsbn] });
    },
  });
}
