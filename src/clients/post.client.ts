// src/clients/postClient.ts
import { FeedDTO } from '@models/feed.model';
import { PostCreateDTO, PostDTO } from '@models/post.model';

const POSTS_BASE = '/api/posts';

/**
 * Cria um novo post vinculado à sua entrada de estante.
 * POST /api/posts
 */
export async function createPost(data: PostCreateDTO): Promise<PostDTO> {
  const res = await fetch(POSTS_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (res.status === 400) {
    const err = await res.json();
    throw new Error(err.error ?? 'Erro ao criar post');
  }
  if (!res.ok) throw new Error('Erro inesperado ao criar post');
  return res.json();
}

/**
 * Edita conteúdo, página atual ou avaliação de um post.
 * PATCH /api/posts/:postId
 */
export async function editPost(
  postId: string,
  data: Partial<{
    content: string;
    currentPage: number;
    rating: number;
  }>,
): Promise<PostDTO> {
  const res = await fetch(`${POSTS_BASE}/${encodeURIComponent(postId)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Erro ao editar post');
  }
  return res.json();
}

/**
 * Exclui um post.
 * DELETE /api/posts/:postId
 */
export async function deletePost(postId: string): Promise<void> {
  const res = await fetch(`${POSTS_BASE}/${encodeURIComponent(postId)}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Erro ao deletar post');
  }
}

/**
 * Busca feed “Amigos” (posts de quem você segue).
 * GET /api/posts/feed/friends?take=&cursor=
 */
export async function feedFriends(take = 20, cursor?: string): Promise<FeedDTO> {
  const params = new URLSearchParams({ take: String(take) });
  if (cursor) params.set('cursor', cursor);

  const res = await fetch(`${POSTS_BASE}/feed/friends?${params}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Erro ao carregar feed de amigos');
  }
  return res.json();
}

/**
 * Busca feed “Descobrir” (posts de quem você não segue).
 * GET /api/posts/feed/discover?take=&cursor=
 */
export async function feedDiscover(take = 20, cursor?: string): Promise<FeedDTO> {
  const params = new URLSearchParams({ take: String(take) });
  if (cursor) params.set('cursor', cursor);

  const res = await fetch(`${POSTS_BASE}/feed/discover?${params}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Erro ao carregar feed de descobrir');
  }
  return res.json();
}
