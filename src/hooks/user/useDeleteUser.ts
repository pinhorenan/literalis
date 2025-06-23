// src/hooks/user/useDeleteUser.ts
'use client';

import { useState } from 'react';
import { UserClient } from '@services/client/user.client';

export function useDeleteUser(username: string) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function remove(): Promise<boolean> {
    setDeleting(true);
    setError(null);
    try {
      await UserClient.delete(username);
      return true;
    } catch (err: any) {
      setError(err);
      return false;
    } finally {
      setDeleting(false);
    }
  }

  return {
    remove,
    deleting,
    error,
  };
}
