// src/hooks/book/useUpdateBookMutation.ts
'use client';

import { useState } from 'react';
import { BookClient } from '@services/client/book.client';
import type { UpdateBookDTO, BookDTO } from '@models/book.dto';

export function useUpdateBookMutation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateBook(isbn: string, data: UpdateBookDTO): Promise<BookDTO | null> {
    setLoading(true);
    setError(null);
    try {
      return await BookClient.update(isbn, data);
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar livro');
      return null;
    } finally {
      setLoading(false);
    }
  }

  return {
    updateBook,
    loading,
    error,
  };
}
