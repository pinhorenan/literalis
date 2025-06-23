// src/hooks/bookshelf/useFollowersList.ts
'use client';

import useSWR from 'swr';
import { FollowClient } from '@services/client/follow.client';
import type { FollowDTO } from '@models/follow.dto';

export function useFollowersList(username: string | null) {
  const shouldFetch = Boolean(username);

  const { data, error, isLoading, mutate } = useSWR<FollowDTO[]>(
    shouldFetch ? `/api/users/${username}/followers` : null,
    () => FollowClient.getFollowers(username!)
  );

  return {
    followers: data,
    isLoading,
    isError: !!error,
    refresh: mutate,
  };
}
