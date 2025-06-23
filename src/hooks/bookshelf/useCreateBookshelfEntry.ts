// src/hooks/bookshelf/useCreateBookshelfEntry.ts
'use client';

import { useState } from 'react';
import { BookshelfClient } from '@services/client/bookshelf.client';
import type { BookshelfCreateDTO, BookshelfDTO } from '@models/bookshelf.dto';

export function useCreateBookshelfEntry() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createEntry(data: BookshelfCreateDTO): Promise<BookshelfDTO | null> {
    setLoading(true);
    setError(null);
    try {
      return await BookshelfClient.add(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao adicionar livro');
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { createEntry, loading, error };
}