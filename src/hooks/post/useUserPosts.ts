// src/hooks/post/useUserPosts.ts
'use client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchUserPosts } from '@/api/posts';
import type { Paginated, Post } from '@/types/index';

export function useUserPosts(username: string) {
  return useInfiniteQuery({
    queryKey: ['posts', 'user', username],
    enabled: !!username,
    initialPageParam: undefined,
    getNextPageParam: (last: Paginated<Post>) => last.nextCursor ?? undefined,
    queryFn: ({ pageParam }) => fetchUserPosts(username, pageParam),
  });
}
