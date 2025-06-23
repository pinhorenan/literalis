// src/hooks/bookshelf/useRemoveBookshelfEntry.ts
'use client';

import { useState } from 'react';
import { BookshelfClient } from '@services/client/bookshelf.client';
import type { BookshelfEntryDTO } from '@models/bookshelf.dto';

export function useRemoveBookshelfEntry() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function removeEntry(isbn: string): Promise<BookshelfEntryDTO | null> {
    setLoading(true);
    setError(null);
    try {
      return await BookshelfClient.remove(isbn);
    } catch (err: any) {
      setError(err.message || 'Erro ao remover entrada');
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { removeEntry, loading, error };
}