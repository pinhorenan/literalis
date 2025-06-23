// src/hooks/bookshelf/useFollowingList.ts
'use client';

import useSWR from 'swr';
import { FollowClient } from '@services/client/follow.client';
import type { FollowDTO } from '@models/follow.dto';

export function useFollowingList(username: string | null) {
  const shouldFetch = Boolean(username);

  const { data, error, isLoading, mutate } = useSWR<FollowDTO[]>(
    shouldFetch ? `/api/users/${username}/following` : null,
    () => FollowClient.getFollowing(username!)
  );

  return {
    following: data,
    isLoading,
    isError: !!error,
    refresh: mutate,
  };
}
