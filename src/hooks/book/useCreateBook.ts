// src/hooks/book/useCreateBook.ts
'use client';

import { useState } from 'react';
import { BookClient } from '@services/client/book.client';
import type { CreateBookDTO, BookDTO } from '@models/book.dto';

export function useCreateBook() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBook = async (data: CreateBookDTO): Promise<BookDTO | null> => {
    setLoading(true);
    setError(null);
    try {
      const book = await BookClient.create(data);
      return book;
    } catch (err: any) {
      setError(err.message || 'Erro ao criar livro');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createBook,
    loading,
    error,
  };
}
