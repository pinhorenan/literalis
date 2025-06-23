// src/hooks/bookshelf/useBookshelfList.ts
'use client';

import useSWR from 'swr';
import { BookshelfClient } from '@services/client/bookshelf.client';
import type { BookshelfDTO } from '@models/bookshelf.dto';

export function useBookshelfList() {
  const { data, error, isLoading, mutate } = useSWR<BookshelfDTO[]>(
    '/api/bookshelf',
    BookshelfClient.list
  );

  return {
    books: data,
    isLoading,
    isError: !!error,
    refresh: mutate,
  };
}