// src/hooks/useFollowers.ts
'use client';
import { useInfiniteQuery, QueryFunctionContext } from '@tanstack/react-query';
import { fetchFollowers, FollowersResponse } from '@/src/data/api/users';

export function useFollowers(username: string) {
  return useInfiniteQuery<
    FollowersResponse, // TQueryFnData
    Error, // TError
    FollowersResponse, // TData
    [string, string], // TQueryKey
    string | undefined // TPageParam
  >({
    queryKey: ['followers', username],
    queryFn: ({ pageParam }: QueryFunctionContext<[string, string], string | undefined>) =>
      fetchFollowers(username, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined,
  });
}
