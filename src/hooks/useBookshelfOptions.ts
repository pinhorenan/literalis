// src/hooks/useBookshelfOptions.ts
'use client';

import { useEffect, useState } from 'react';
import { BookshelfService } from '@services/client/bookshelf.service';
import type { UserBookDTO } from '@models/userBook.dto';

export default function useBookshelfOptions() {
  const [books, setBooks] = useState<UserBookDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookshelf() {
      try {
        const allBooks = await BookshelfService.getMyBooks();
        const filtered = allBooks.filter(book =>
          ['READING', 'TO_READ'].includes(book.status)
        );
        setBooks(filtered);
      } catch (err) {
        setError('Erro ao carregar estante');
      } finally {
        setLoading(false);
      }
    }

    fetchBookshelf();
  }, []);

  return { books, loading, error }; // <-- ESSENCIAL
}
