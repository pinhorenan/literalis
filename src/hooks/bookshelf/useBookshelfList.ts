// src/hooks/bookshelf/useBookshelfList.ts
'use client';

import useSWR from 'swr';
import { BookshelfClient } from '@services/client/bookshelf.client';
import type { BookshelfEntryDTO } from '@models/bookshelf.dto';

export function useBookshelfList() {
  const { data, error, isLoading, mutate } = useSWR<BookshelfEntryDTO[]>(
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