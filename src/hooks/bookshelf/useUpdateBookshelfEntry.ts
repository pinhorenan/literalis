// src/hooks/bookshelf/useUpdateBookshelfEntry.ts
'use client';

import { useState } from 'react';
import { BookshelfClient } from '@services/client/bookshelf.client';
import type { BookshelfEntryDTO, BookshelfUpdateDTO } from '@models/bookshelf.dto';

export function useUpdateBookshelfEntry() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateEntry(isbn: string, data: BookshelfUpdateDTO): Promise<BookshelfEntryDTO | null> {
    setLoading(true);
    setError(null);
    try {
      return await BookshelfClient.update(isbn, data);
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar entrada');
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { updateEntry, loading, error };
}