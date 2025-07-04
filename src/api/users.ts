// src/api/users.ts
import type {
  UserProfileData,
  UserFollowersData,
  UserFollowingData,
  UserBookCountData,
} from '@/types/user';

export async function fetchUserProfile(username: string): Promise<UserProfileData> {
  const res = await fetch(`/api/users/${username}`);
  if (!res.ok) throw new Error('Erro ao buscar perfil do usuário');
  return res.json();
}

export async function postToggleFollow(username: string): Promise<{
  isFollowing: boolean;
  followersCount: number;
}> {
  const res = await fetch(`/api/users/${username}/follow`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Erro ao alternar follow');
  return res.json();
}

export async function fetchFollowers(
  username: string,
  cursor?: string,
): Promise<UserFollowersData> {
  const url = new URL(`/api/users/${username}/followers`, window.location.origin);
  if (cursor) url.searchParams.set('cursor', cursor);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Erro ao buscar seguidores');
  return res.json();
}

export async function fetchFollowing(
  username: string,
  cursor?: string,
): Promise<UserFollowingData> {
  const url = new URL(`/api/users/${username}/following`, window.location.origin);
  if (cursor) url.searchParams.set('cursor', cursor);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Erro ao buscar seguindo');
  return res.json();
}

export async function fetchBooksCount(username: string): Promise<UserBookCountData> {
  const res = await fetch(`/api/users/${username}/bookshelf/count`); // TODO!
  if (!res.ok) throw new Error('Erro ao buscar contagem de livros na estante');
  return res.json();
}
