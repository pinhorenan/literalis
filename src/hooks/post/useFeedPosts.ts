// src/hooks/post/useFeedPosts.ts
'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import * as api from '@/api/posts';
import type { Post } from '@/types/post';
import type { Paginated } from '@/types/common';

export function useFeedPosts() {
  return useInfiniteQuery<
    Paginated<Post>,
    Error,
    Paginated<Post>,
    ['posts', 'feed'],
    string | undefined
  >({
    queryKey: ['posts', 'feed'],
    queryFn: async ({ pageParam }) => {
      const raw = await api.fetchFeedPosts(pageParam);
      /* converte strings ISO em Date */
      return {
        ...raw,
        items: raw.items.map((p) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
        })),
      };
    },
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    initialPageParam: undefined,
  });
}
