'use client';
import { useEffect, useState } from 'react';
import { UserClient } from '@services/client/user.client';
import type { UserProfileDTO } from '@/src/models/user.model';

export default function useUser(username: string | null) {
  const [user, setUser]         = useState<UserProfileDTO | null>(null);
  const [loading, setLoading]   = useState<boolean>(!!username);
  const [error, setError]       = useState<string | null>(null);

  async function refetch() {
    if (!username) return;
    setLoading(true);
    try {
      const data = await UserClient.get(username);
      setUser(data);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refetch(); }, [username]);

  return { user, loading, error, refetch, setUser };
}
