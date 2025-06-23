// src/hooks/userbook/usePublicUserBooks.ts
'use client';

import useSWR from 'swr';
import { UserBookClientService } from '@services/client/userBook.client';

export default function usePublicUserBooks(username: string | null) {
  const shouldFetch = Boolean(username);

  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? `/userbook/public/${username}` : null,
    () => UserBookClientService.listPublic(username!)
  );

  return {
    books: data,
    isLoading,
    isError: error,
    mutate,
  };
}
