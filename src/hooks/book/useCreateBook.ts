// src/hooks/book/useCreateBook.ts
'use client';

import { useState } from 'react';
import { BookClient } from '@services/client/book.client';
import type { CreateBookDTO, BookDTO } from '@/src/models/book.model';

export function useCreateBook() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createBook(data: CreateBookDTO): Promise<BookDTO | null> {
    setLoading(true);
    setError(null);
    try {
      return await BookClient.create(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar livro');
      return null;
    } finally {
      setLoading(false);
    }
  }

  return {
    createBook,
    loading,
    error,
  };
}
