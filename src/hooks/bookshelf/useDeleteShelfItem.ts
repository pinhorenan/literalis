// src/hooks/bookshelf/useDeleteShelfItem.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteShelfItemClient } from '@/src/api/bookshelf';

/**
 * Hook para soft-delete de um item da estante.
 */
export function useDeleteShelfItem(username: string) {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (isbn) => deleteShelfItemClient(username, isbn),
    onSuccess: (_data, isbn) => {
      qc.invalidateQueries({ queryKey: ['shelf', username] });
      qc.invalidateQueries({ queryKey: ['shelf', username, isbn] });
    },
  });
}
