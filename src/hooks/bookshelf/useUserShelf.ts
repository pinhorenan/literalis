// src/hooks/bookshelf/useUserShelf.ts
'use client';

import { useInfiniteQuery, QueryFunctionContext } from '@tanstack/react-query';
import { fetchUserShelf } from '@/api/bookshelf';
import type { Paginated } from '@/types/common';
import type { ShelfItem } from '@/types/bookshelf';

export function useUserShelf(username: string) {
  return useInfiniteQuery<
    Paginated<ShelfItem>,
    Error,
    Paginated<ShelfItem>,
    ['shelf', string],
    string | undefined
  >({
    queryKey: ['shelf', username],
    queryFn: ({ pageParam }: QueryFunctionContext<['shelf', string], string | undefined>) =>
      fetchUserShelf(username, pageParam),
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    initialPageParam: undefined,
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(username),
  });
}
