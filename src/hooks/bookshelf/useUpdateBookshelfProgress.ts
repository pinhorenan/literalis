// src/hooks/bookshelf/useUpdateBookshelfProgress.ts
'use client';

import { useState } from 'react';
import { BookshelfClient } from '@services/client/bookshelf.client';
import type { BookshelfDTO } from '@models/bookshelf.dto';

export function useUpdateBookshelfProgress() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateProgress(isbn: string, currentPage: number): Promise<BookshelfDTO | null> {
    setLoading(true);
    setError(null);
    try {
      return await BookshelfClient.updateProgress(isbn, currentPage);
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar progresso');
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { updateProgress, loading, error };
}