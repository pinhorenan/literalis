// src/hooks/bookshelf/useUserShelf.ts
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchUserShelf,
  fetchShelfItem,
  upsertShelfItemClient,
  deleteShelfItemClient,
} from '@/src/data/api/bookshelf';
import type { BookshelfItemData } from '@/src/services/bookshelf.service';

export function useUserShelf(userId: string) {
  return useQuery<BookshelfItemData[]>({
    queryKey: ['shelf', userId],
    queryFn: () => fetchUserShelf(userId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useShelfItem(userId: string, isbn: string) {
  return useQuery<BookshelfItemData>({
    queryKey: ['shelf', userId, isbn],
    queryFn: () => fetchShelfItem(userId, isbn),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(isbn),
  });
}

export function useUpsertShelfItem() {
  const queryClient = useQueryClient();
  return useMutation<BookshelfItemData, Error, Omit<BookshelfItemData, 'addedAt' | 'updatedAt'>>({
    mutationFn: upsertShelfItemClient,
    onSuccess: (data: BookshelfItemData) => {
      queryClient.invalidateQueries({ queryKey: ['shelf', data.userId] });
    },
  });
}

export function useDeleteShelfItem() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { userId: string; isbn: string }>({
    mutationFn: ({ userId, isbn }: { userId: string; isbn: string }) =>
      deleteShelfItemClient(userId, isbn),
    onSuccess: (_data: void, variables: { userId: string; isbn: string }) => {
      queryClient.invalidateQueries({ queryKey: ['shelf', variables.userId] });
    },
  });
}
