// src/hooks/post/useFeedPosts.ts
'use client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchFeedPosts } from '@/api/posts';
import type { Paginated, Post } from '@/types/index';

export function useFeedPosts() {
  return useInfiniteQuery({
    queryKey: ['posts', 'feed'],
    initialPageParam: undefined,
    getNextPageParam: (last: Paginated<Post>) => last.nextCursor ?? undefined,
    queryFn: async ({ pageParam }) => {
      const raw = await fetchFeedPosts(pageParam);
      console.log('useFeedPosts', raw);
      return {
        ...raw,
        items: raw.items.map((p) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
        })),
      };
    },
    gcTime: 1000 * 60 * 5,
    staleTime: 1000 * 30,
  });
}
