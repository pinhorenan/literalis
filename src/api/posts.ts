// src/api/posts.ts
import type { Paginated } from '@/types/common';
import type { Post, Comment } from '@/types/post';

/* -------------------------------------------------------------------------- */
/* utilitário de fetch com tratamento de erro                                 */
/* -------------------------------------------------------------------------- */
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, { credentials: 'include', ...options });
  if (!res.ok) {
    // sinaliza falhas 4xx/5xx conforme guias REST
    // 204 (no-content) não entra aqui
    throw new Error(`Erro ${res.status} — ${res.statusText || 'Falha na requisição'}`);
  }
  // 204 No Content devolve corpo vazio
  return res.status === 204 ? (undefined as T) : res.json();
}

/* -------------------------------------------------------------------------- */
/* queries                                                                    */
/* -------------------------------------------------------------------------- */

/** GET /api/posts/:id */
export function fetchPost(id: string) {
  return request<Post>(`/api/posts/${id}`);
}

/** GET /api/posts/user/:username?cursor=<id> */
export function fetchUserPosts(username: string, cursor?: string, take = 20) {
  const url = new URL(`/api/user/${username}/posts`, window.location.origin);
  url.searchParams.set('take', String(take));
  if (cursor) url.searchParams.set('cursor', cursor);
  return request<Paginated<Post>>(url.toString());
}

/** GET /api/posts/feed?cursor=<id> */
export function fetchFeedPosts(cursor?: string, take = 20) {
  const url = new URL('/api/posts/feed', window.location.origin);
  url.searchParams.set('take', String(take));
  if (cursor) url.searchParams.set('cursor', cursor);
  return request<Paginated<Post>>(url.toString());
}

/* -------------------------------------------------------------------------- */
/* mutations                                                                  */
/* -------------------------------------------------------------------------- */

/** POST /api/posts */
export function createPost(data: {
  bookIsbn: string;
  content: string;
  progress?: number;
  currentPage?: number;
  totalPages?: number;
  rating?: number;
}) {
  return request<Post>('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

/** DELETE /api/posts/:id  – servidor deve retornar 204 No Content */
export function deletePost(id: string) {
  return request<void>(`/api/posts/${id}`, { method: 'DELETE' });
}

/** POST /api/posts/:id/like  (toggle) */
export function toggleLikePost(id: string) {
  return request<{ liked: boolean; likesCount: number }>(`/api/posts/${id}/like`, {
    method: 'POST',
  });
}

/** POST /api/posts/:id/comments */
export function commentPost(id: string, content: string) {
  return request<Comment>(`/api/posts/${id}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
}
