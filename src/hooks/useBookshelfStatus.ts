// src/hooks/useBookshelfStatus.ts
import { useCallback } from 'react';
import useSWR from 'swr';
import { BookshelfService } from '@services/BookshelfService';

export default function useBookshelfStatus(isbn: string) {
  const { data, error, mutate, isValidating } = useSWR(
    isbn ? ['inShelf', isbn] : null,
    () => BookshelfService.isInShelf(isbn)
  );

  const toggle = useCallback(async () => {
    if (!isbn) return;
    const current = data ?? false;
    // optimistic UI
    mutate(!current, false);
    try {
      current
        ? await BookshelfService.remove(isbn)
        : await BookshelfService.add(isbn);
      mutate(); // revalidate
    } catch {
      mutate(); // rollback
    }
  }, [isbn, data, mutate]);

  return { added: data ?? false, loading: isValidating, error, toggle };
}
