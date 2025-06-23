// src/hooks/bookshelf/useUpdateBookshelfStatus.ts
'use client';

import { useState } from 'react';
import { BookshelfClient } from '@services/client/bookshelf.client';
import type { BookshelfDTO } from '@models/bookshelf.dto';
import { ShelfStatus } from '@prisma/client';

export function useUpdateBookshelfStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateStatus(isbn: string, status: ShelfStatus): Promise<BookshelfDTO | null> {
    setLoading(true);
    setError(null);
    try {
      return await BookshelfClient.updateStatus(isbn, status);
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar status');
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { updateStatus, loading, error };
}