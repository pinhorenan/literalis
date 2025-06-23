// src/hooks/book/useDeleteBook.ts
'use client';

import { useState } from 'react';
import { BookClient } from '@services/client/book.client';

export function useDeleteBook() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function deleteBook(isbn: string): Promise<boolean> {
    setLoading(true);
    setError(null);
    try {
      await BookClient.delete(isbn);
      return true;
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar livro');
      return false;
    } finally {
      setLoading(false);
    }
  }

  return {
    deleteBook,
    loading,
    error,
  };
}
