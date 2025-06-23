// src/hooks/bookshelf/useBookshelfEntry.ts
'use client';

import useSWR from 'swr';
import { BookshelfClient } from '@services/client/bookshelf.client';
import type { BookshelfDTO } from '@models/bookshelf.dto';

export function useBookshelfEntry(isbn?: string | null) {
  const shouldFetch = Boolean(isbn);

  const { data, error, isLoading, mutate } = useSWR<BookshelfDTO>(
    shouldFetch ? `/api/bookshelf/${isbn}` : null,
    () => BookshelfClient.get(isbn!)
  );

  return {
    book: data,
    isLoading,
    isError: !!error,
    refresh: mutate,
  };
}
