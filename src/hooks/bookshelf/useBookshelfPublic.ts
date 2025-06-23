// src/hooks/bookshelf/useBookshelfPublic.ts
'use client';

import useSWR from 'swr';
import { BookshelfClient } from '@services/client/bookshelf.client';
import type { BookshelfDTO } from '@models/bookshelf.dto';

export function useBookshelfPublic(username: string | null) {
  const shouldFetch = Boolean(username);

  const { data, error, isLoading, mutate } = useSWR<BookshelfDTO[]>(
    shouldFetch ? `/api/users/${username}/bookshelf/` : null,
    () => BookshelfClient.listPublic(username!)
  );

  return {
    books: data,
    isLoading,
    isError: !!error,
    refresh: mutate,
  };
}