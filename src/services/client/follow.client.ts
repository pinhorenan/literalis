// src/services/client/follow.client.ts
import type { FollowDTO } from '@models/follow.dto';

export const FollowClient = {
  async toggle(username: string): Promise<{ followed: boolean }> {
    const res = await fetch(`/api/users/${username}/follow`, { method: 'PATCH' });
    if (!res.ok) throw new Error('Erro ao seguir/desseguir');
    return res.json();
  },

  async getFollowers(username: string): Promise<FollowDTO[]> {
    const res = await fetch(`/api/users/${username}/followers`);
    if (!res.ok) throw new Error('Erro ao buscar seguidores');
    return res.json();
  },

  async getFollowing(username: string): Promise<FollowDTO[]> {
    const res = await fetch(`/api/users/${username}/following`);
    if (!res.ok) throw new Error('Erro ao buscar seguindo');
    return res.json();
  },
};
