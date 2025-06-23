// src/hooks/user/useSearchUser.ts
'use client';

import useSWR from 'swr';
import { UserClient } from '@services/client/user.client';
import type { PublicUserDTO } from '@models/user.dto';

export default function useSearchUser(query: string) {
  const shouldFetch = query.length >= 2;

  const { data, error, isLoading } = useSWR<PublicUserDTO[]>(
    shouldFetch ? `/api/users/search?q=${query}` : null,
    () => UserClient.search(query)
  );

  return {
    users: data || [],
    isLoading,
    error,
  };
}
