// src/hooks/user/useUserSearch.ts
'use client';

import useSWR from 'swr';
import { UserServiceClient } from '@services/client/user.client';
import type { PublicUserDTO } from '@models/user.dto';

export default function useUserSearch(query: string) {
  const shouldFetch = query.length >= 2;

  const { data, error, isLoading } = useSWR<PublicUserDTO[]>(
    shouldFetch ? `/api/users/search?q=${query}` : null,
    () => UserServiceClient.search(query)
  );

  return {
    users: data || [],
    isLoading,
    error,
  };
}
