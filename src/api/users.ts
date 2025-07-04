// src/api/users.ts

export interface UserProfileResponse {
  user: {
    id: string;
    username: string;
    name: string;
    avatarUrl: string;
    bio: string;
  };
  counts: {
    followers: number;
    following: number;
    posts: number;
  };
  isFollowing: boolean;
  isMe: boolean;
}

export interface FollowersResponse {
  followers: Array<{
    id: string;
    username: string;
    name: string | null;
    avatarUrl: string | null;
  }>;
  nextCursor: string | null;
}

export interface FollowingResponse {
  following: Array<{
    id: string;
    username: string;
    name: string | null;
    avatarUrl: string | null;
  }>;
  nextCursor: string | null;
}

export interface BooksCountResponse {
  booksCount: number;
}

// 1 perfil completo
export async function fetchUserProfile(username: string): Promise<UserProfileResponse> {
  const res = await fetch(`/api/users/${username}`);
  if (!res.ok) throw new Error('Erro ao buscar perfil do usuário');
  return res.json();
}

// 2 toggling follow
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

// 3 seguidores
export async function fetchFollowers(
  username: string,
  cursor?: string,
): Promise<FollowersResponse> {
  const url = new URL(`/api/users/${username}/followers`, window.location.origin);
  if (cursor) url.searchParams.set('cursor', cursor);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Erro ao buscar seguidores');
  return res.json();
}

// 4 seguindo
export async function fetchFollowing(
  username: string,
  cursor?: string,
): Promise<FollowingResponse> {
  const url = new URL(`/api/users/${username}/following`, window.location.origin);
  if (cursor) url.searchParams.set('cursor', cursor);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Erro ao buscar seguindo');
  return res.json();
}

// 5 contagem de livros na estante
export async function fetchBooksCount(username: string): Promise<BooksCountResponse> {
  const res = await fetch(`/api/users/${username}/bookshelf/count`); // TODO!
  if (!res.ok) throw new Error('Erro ao buscar contagem de livros na estante');
  return res.json();
}
