// src/hooks/book/useBookDelete.ts
'use client';

import { useState } from 'react';
import { BookClient } from '@services/client/book.client';
import type { BookDTO } from '@models/book.dto';

export function useBookDelete() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteBook = async (isbn: string): Promise<BookDTO | null> => {
    setLoading(true);
    setError(null);
    try {
      const book = await BookClient.delete(isbn);
      return book;
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar livro');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteBook,
    loading,
    error,
  };
}
