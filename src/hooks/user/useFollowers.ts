// src/hooks/useFollowers.ts
'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchFollowers } from '@/api/users';
import type { FollowersPage } from '@/types/user';

export function useFollowers(username: string) {
  return useInfiniteQuery<
    FollowersPage,
    Error,
    FollowersPage,
    [string, string],
    string | undefined
  >({
    queryKey: ['followers', username],
    queryFn: ({ pageParam }) => fetchFollowers(username, pageParam),
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    initialPageParam: undefined,
  });
}
