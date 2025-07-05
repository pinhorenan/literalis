// src/hooks/bookshelf/useUserShelf.ts
'use client';

import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchUserShelf,
  fetchShelfItem,
  upsertShelfItemClient,
  deleteShelfItemClient,
} from '@/src/api/bookshelf';
import type { Paginated } from '@/types/common';
import type { ShelfItem } from '@/types/bookshelf';

/* -------- LISTAGEM (cursor-based) -------- */
export function useUserShelf(userId: string) {
  return useInfiniteQuery<
    Paginated<ShelfItem>, // TQueryFnData: o retorno de fetchUserShelf
    Error, // TError
    Paginated<ShelfItem>, // TData (após possível select)
    [string, string], // TQueryKey (['shelf', userId])
    string | undefined // TPageParam —— aqui definimos o tipo de pageParam
  >({
    queryKey: ['shelf', userId],
    queryFn: ({ pageParam }) => fetchUserShelf(userId, pageParam),
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    initialPageParam: undefined,
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(userId),
  });
}

/* -------- ITEM ISOLADO -------- */
export function useShelfItem(userId: string, isbn: string) {
  return useQuery<ShelfItem, Error>({
    queryKey: ['shelf', userId, isbn],
    queryFn: () => fetchShelfItem(userId, isbn),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(userId && isbn),
  });
}

/* -------- UPSERT -------- */
export function useUpsertShelfItem() {
  const qc = useQueryClient();
  return useMutation<ShelfItem, Error, Omit<ShelfItem, 'addedAt' | 'updatedAt' | 'removedAt'>>({
    mutationFn: upsertShelfItemClient,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['shelf', data.userId] });
      qc.invalidateQueries({ queryKey: ['shelf', data.userId, data.bookIsbn] });
    },
  });
}

/* -------- DELETE -------- */
export function useDeleteShelfItem() {
  const qc = useQueryClient();
  return useMutation<void, Error, { userId: string; isbn: string }>({
    mutationFn: ({ userId, isbn }) => deleteShelfItemClient(userId, isbn),
    onSuccess: (_, { userId, isbn }) => {
      qc.invalidateQueries({ queryKey: ['shelf', userId] });
      qc.invalidateQueries({ queryKey: ['shelf', userId, isbn] });
    },
  });
}
