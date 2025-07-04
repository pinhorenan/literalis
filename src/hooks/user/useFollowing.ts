// src/hooks/useFollowing.ts
'use client';
import { useInfiniteQuery, QueryFunctionContext } from '@tanstack/react-query';
import { fetchFollowing, FollowingResponse } from '@/api/users';

export function useFollowing(username: string) {
  return useInfiniteQuery<
    FollowingResponse,
    Error,
    FollowingResponse,
    [string, string],
    string | undefined
  >({
    queryKey: ['following', username],
    queryFn: ({ pageParam }: QueryFunctionContext<[string, string], string | undefined>) =>
      fetchFollowing(username, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined,
  });
}
