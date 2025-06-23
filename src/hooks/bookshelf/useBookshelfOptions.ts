// src/hooks/bookshelf/useBookshelfOptions.ts
'use client';

import useSWR from 'swr';
import { BookshelfClient } from '@services/client/bookshelf.client';
import type { BookshelfOptionDTO } from '@models/bookshelf.dto';

export function useBookshelfOptions() {
  const { data, error, isLoading, mutate } = useSWR<BookshelfOptionDTO[]>(
    '/api/bookshelf/options',
    BookshelfClient.options
  );

  return {
    options: data,
    isLoading,
    isError: !!error,
    refresh: mutate,
  };
}