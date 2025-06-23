// src/hooks/userbook/useUserBooks.ts
'use client';

import useSWR from 'swr';
import { UserBookClientService } from '@/src/services/client/userBook.client';

export default function useUserBooks() {
  const { data, error, isLoading, mutate } = useSWR(
    '/userbook/list',
    () => UserBookClientService.list()
  );

  return {
    books: data,
    isLoading,
    isError: error,
    mutate,
  };
}
