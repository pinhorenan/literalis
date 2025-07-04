// src/hooks/useFollowing.ts
'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchFollowing } from '@/src/api/users';
import type { FollowingPage } from '@/src/types/user';

export function useFollowing(username: string) {
  return useInfiniteQuery<
    FollowingPage, // TQueryFnData
    Error, // TError
    FollowingPage, // TData
    [string, string], // TQueryKey
    string | undefined // TPageParam
  >({
    queryKey: ['following', username],
    queryFn: ({ pageParam }) => fetchFollowing(username, pageParam),
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    initialPageParam: undefined,
  });
}
