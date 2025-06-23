// src/hooks/userbook/useUserBookOptions.ts
'use client';

import useSWR from 'swr';
import { UserBookClientService } from '@services/client/userBook.client';

export default function useUserBookOptions() {
  const { data, error, isLoading, mutate } = useSWR(
    '/userbook/options',
    () => UserBookClientService.options()
  );

  return {
    options: data,
    isLoading,
    isError: error,
    mutate,
  };
}
