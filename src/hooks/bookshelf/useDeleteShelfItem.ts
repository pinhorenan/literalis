// src/hooks/bookshelf/useDeleteShelfItem.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteShelfItemClient } from '@/api/bookshelf';

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
