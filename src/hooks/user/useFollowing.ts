// src/hooks/useFollowing.ts
'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchFollowing } from '@/api/users';
import type { FollowingPage } from '@/types/user';

export function useFollowing(username: string) {
  return useInfiniteQuery<
    FollowingPage,
    Error,
    FollowingPage,
    [string, string],
    string | undefined
  >({
    queryKey: ['following', username],
    queryFn: ({ pageParam }) => fetchFollowing(username, pageParam),
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    initialPageParam: undefined,
  });
}
