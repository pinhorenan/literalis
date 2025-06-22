// src/hooks/search/useUserSearch.ts
'use client';

import useSWR from 'swr';
import { fetcher } from '@lib/fetcher';
import type { UserDTO } from '@models/user.dto';

export default function useUserSearch(query: string) {
  const shouldFetch = query.trim().length > 0;

  const { data, error, isLoading } = useSWR<UserDTO[]>(
    shouldFetch ? `/api/search/users?q=${encodeURIComponent(query)}` : null,
    fetcher
  );

  return {
    users: data ?? [],
    isLoading,
    error,
  };
}
