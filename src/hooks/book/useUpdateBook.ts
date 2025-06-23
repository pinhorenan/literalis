// src/hooks/book/useUpdateBook.ts
'use client';

import { useState } from 'react';
import { BookClient } from '@services/client/book.client';
import type { UpdateBookDTO, BookDTO } from '@models/book.dto';

export function useUpdateBook() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateBook = async (isbn: string, data: UpdateBookDTO): Promise<BookDTO | null> => {
    setLoading(true);
    setError(null);
    try {
      const book = await BookClient.update(isbn, data);
      return book;
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar livro');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateBook,
    loading,
    error,
  };
}
