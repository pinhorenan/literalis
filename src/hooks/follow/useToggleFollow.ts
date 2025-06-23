// src/hooks/follow/useToggleFollow.ts
'use client';

import { useState } from 'react';
import { FollowClient } from '@services/client/follow.client';
import { useFollowContext } from '@context/followContext';

export function useToggleFollow(initialState: boolean, targetUsername: string) {
  const { setFollow } = useFollowContext();
  const [loading, setLoading] = useState(false);
  const [followed, setFollowed] = useState(initialState);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    setLoading(true);
    setError(null);
    const optimistic = !followed;
    setFollowed(optimistic);
    setFollow(targetUsername, optimistic);

    try {
      const { followed: confirmed } = await FollowClient.toggle(targetUsername);
      setFollowed(confirmed);
      setFollow(targetUsername, confirmed);
    } catch (e: any) {
      setError(e.message || 'Falha ao seguir');
      setFollowed(!optimistic); // rollback
      setFollow(targetUsername, !optimistic);
    } finally {
      setLoading(false);
    }
  }

  return { followed, toggle, loading, error };
}
