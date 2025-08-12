// src/hooks/post/useUserPosts.ts
'use client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchUserPosts } from '@/api/posts';
import type { Paginated, Post } from '@/types/index';

export function useUserPosts(username: string, options?: { enabled?: boolean }) {
  return useInfiniteQuery({
    queryKey: ['posts', 'user', username],
    enabled: (options?.enabled ?? true) && !!username,
    initialPageParam: undefined,
    getNextPageParam: (last: Paginated<Post>) => last.nextCursor ?? undefined,
    queryFn: async ({ pageParam }) => {
      const raw = await fetchUserPosts(username, pageParam);
      return {
        ...raw,
        items: raw.items.map((p) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
        })),
      };
    },
  });
}
