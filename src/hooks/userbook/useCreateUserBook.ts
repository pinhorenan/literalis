// src/hooks/userbook/useCreateUserBook.ts
'use client';

import { useState } from 'react';
import { UserBookClientService } from '@/src/services/client/userBook.client';
import type { UserBookCreateDTO, UserBookDTO } from '@models/userBook.dto';

export default function useCreateUserBook() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const add = async (data: UserBookCreateDTO): Promise<UserBookDTO | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await UserBookClientService.add(data);
      return result;
    } catch (err) {
      setError((err as Error).message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { add, loading, error };
}