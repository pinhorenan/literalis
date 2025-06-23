// src/hooks/userbook/useRemoveUserBook.ts
'use client';

import { useState } from 'react';
import { UserBookClientService } from '@services/client/userBook.client';
import type { UserBookDTO } from '@models/userBook.dto';

export default function useRemoveUserBook() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async (isbn: string): Promise<UserBookDTO | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await UserBookClientService.remove(isbn);
      return result;
    } catch (err) {
      setError((err as Error).message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
}