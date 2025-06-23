// src/hooks/user/useUserCreate.ts
'use client';
import { useState } from 'react';
import { UserServiceClient } from '@services/client/user.client';
import type { CreateUserDTO } from '@models/user.dto';

export function useUserCreate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function create(data: CreateUserDTO) {
    setLoading(true);
    setError(null);
    try {
      return await UserServiceClient.create(data);
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { create, loading, error };
}
