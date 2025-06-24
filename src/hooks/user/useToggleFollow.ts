'use client';
import { useState } from 'react';
import { UserClient } from '@services/client/user.client';

/**
 * Controle de seguir/desseguir um usuário.
 * Use `initialFollowed` vindo do backend (p.ex. comparando arrays de seguidores)
 */
export default function useToggleFollow(
  username: string,
  initialFollowed: boolean,
  initialFollowersCount: number
) {
  const [followed, setFollowed]       = useState(initialFollowed);
  const [followers, setFollowers]     = useState(initialFollowersCount);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);

  async function toggle() {
    setLoading(true);
    const optimistic = !followed;
    // otimista
    setFollowed(optimistic);
    setFollowers(c => optimistic ? c + 1 : c - 1);

    try {
      const { followed: confirmed } = await UserClient.toggleFollow(username);
      setFollowed(confirmed);
      setFollowers(c => confirmed ? Math.max(c, 0) : Math.max(c - 1, 0));
      setError(null);
    } catch (e: any) {
      // rollback
      setFollowed(!optimistic);
      setFollowers(c => !optimistic ? c + 1 : c - 1);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return { followed, followers, toggle, loading, error };
}
