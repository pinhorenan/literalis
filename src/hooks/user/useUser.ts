// src/hooks/user/useUser.ts
'use client';

import useSWR from 'swr';
import { UserServiceClient } from '@services/client/user.client';
import type { UserDTO } from '@models/user.dto';

export function useUser(username: string | null) {
  const shouldFetch = Boolean(username);

  const { data, error, isLoading, mutate } = useSWR<UserDTO>(
    shouldFetch ? `/api/users/${username}` : null,
    () => UserServiceClient.getByUsername(username!)
  );

  return {
    user: data,
    loading: isLoading,
    error,
    refresh: mutate,
  };
}
