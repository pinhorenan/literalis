// src/hooks/post/useUserPosts.ts
'use client';
import { useInfiniteQuery, QueryFunctionContext } from '@tanstack/react-query';
import * as api from '@/api/posts';
import type { Post } from '@/types/post';
import type { Paginated } from '@/types/common';

export function useUserPosts(username: string) {
  return useInfiniteQuery<
    Paginated<Post>,
    Error,
    Paginated<Post>,
    ['posts', 'user', string],
    string | undefined
  >({
    queryKey: ['posts', 'user', username],
    queryFn: ({ pageParam }: QueryFunctionContext<['posts', 'user', string], string | undefined>) =>
      api.fetchUserPosts(username, pageParam),
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    initialPageParam: undefined,
    enabled: Boolean(username),
  });
}
