// src/api/users.ts
import type { UserProfile, FollowersPage, FollowingPage, BooksCount } from '@/types/index';

/* GET /users/[username] ---------------------------------------------------- */
export async function fetchUserProfile(username: string): Promise<UserProfile> {
  const res = await fetch(`/api/users/${username}`);
  if (!res.ok) throw new Error('Erro ao buscar perfil do usuário');
  return res.json();
}

/* POST /users/[username]/follow ------------------------------------------- */
export async function postToggleFollow(username: string): Promise<{
  isFollowing: boolean;
  followersCount: number;
}> {
  const res = await fetch(`/api/users/${username}/follow`, { method: 'POST' });
  if (!res.ok) throw new Error('Erro ao alternar follow');
  return res.json();
}

/* GET /users/[username]/followers ----------------------------------------- */
export async function fetchFollowers(username: string, cursor?: string): Promise<FollowersPage> {
  const url = new URL(`/api/users/${username}/followers`, window.location.origin);
  if (cursor) url.searchParams.set('cursor', cursor);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Erro ao buscar seguidores');
  return res.json();
}

/* GET /users/[username]/following ----------------------------------------- */
export async function fetchFollowing(username: string, cursor?: string): Promise<FollowingPage> {
  const url = new URL(`/api/users/${username}/following`, window.location.origin);
  if (cursor) url.searchParams.set('cursor', cursor);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Erro ao buscar seguindo');
  return res.json();
}

// ESSE AQ TODO REFAZER MTO RUIM
/* GET /users/[username]/bookshelf/count ----------------------------------- */
export async function fetchBooksCount(username: string): Promise<BooksCount> {
  const res = await fetch(`/api/users/${username}/bookshelf/count`);
  if (!res.ok) throw new Error('Erro ao buscar contagem de livros na estante');
  return res.json();
}
