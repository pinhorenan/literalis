// src/hooks/userbook/useUpdateUserBook.ts
'use client';

import { useState } from 'react';
import { UserBookClientService } from '@services/client/userBook.client';
import type { UserBookDTO, UserBookUpdateDTO } from '@models/userBook.dto';

export default function useUpdateUserBook() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (isbn: string, data: UserBookUpdateDTO): Promise<UserBookDTO | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await UserBookClientService.update(isbn, data);
      return result;
    } catch (err) {
      setError((err as Error).message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}