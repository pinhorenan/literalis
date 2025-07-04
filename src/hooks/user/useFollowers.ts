// src/hooks/useFollowers.ts
'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchFollowers } from '@/src/api/users';
import type { FollowersPage } from '@/src/types/user';

export function useFollowers(username: string) {
  return useInfiniteQuery<
    FollowersPage, // TQueryFnData
    Error, // TError
    FollowersPage, // TData
    [string, string], // TQueryKey
    string | undefined // TPageParam
  >({
    queryKey: ['followers', username],
    queryFn: ({ pageParam }) => fetchFollowers(username, pageParam),
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    initialPageParam: undefined,
  });
}
