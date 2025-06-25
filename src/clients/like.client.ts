// src/clients/likeClient.ts
import { MinimalUserDTO } from '@models/user.model';
const POSTS_BASE = '/api/posts';
const COMMENTS_BASE = '/api/comments';

/**
 * Curte um post.
 * POST /api/posts/:postId/like
 */
export async function likePost(postId: string): Promise<void> {
  const res = await fetch(`${POSTS_BASE}/${encodeURIComponent(postId)}/like`, { method: 'POST' });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Erro ao curtir post');
  }
}

/**
 * Descurte um post.
 * DELETE /api/posts/:postId/like
 */
export async function unlikePost(postId: string): Promise<void> {
  const res = await fetch(`${POSTS_BASE}/${encodeURIComponent(postId)}/like`, { method: 'DELETE' });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Erro ao descurtir post');
  }
}

/**
 * Lista usuários que curtiram um post.
 * GET /api/posts/:postId/likes?take=
 */
export async function listPostLikes(postId: string, take = 10): Promise<MinimalUserDTO[]> {
  const res = await fetch(`${POSTS_BASE}/${encodeURIComponent(postId)}/likes?take=${take}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Erro ao listar curtidas do post');
  }
  return res.json();
}

/**
 * Verifica se o usuário logado curtiu um post.
 * GET /api/posts/:postId/isLiked
 */
export async function isPostLiked(postId: string): Promise<boolean> {
  const res = await fetch(`${POSTS_BASE}/${encodeURIComponent(postId)}/isLiked`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Erro ao verificar curtida do post');
  }
  const { liked } = await res.json();
  return liked;
}

/**
 * Curte um comentário.
 * POST /api/comments/:commentId/like
 */
export async function likeComment(commentId: string): Promise<void> {
  const res = await fetch(`${COMMENTS_BASE}/${encodeURIComponent(commentId)}/like`, {
    method: 'POST',
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Erro ao curtir comentário');
  }
}

/**
 * Descurte um comentário.
 * DELETE /api/comments/:commentId/like
 */
export async function unlikeComment(commentId: string): Promise<void> {
  const res = await fetch(`${COMMENTS_BASE}/${encodeURIComponent(commentId)}/like`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Erro ao descurtir comentário');
  }
}

/**
 * Lista usuários que curtiram um comentário.
 * GET /api/comments/:commentId/likes?take=
 */
export async function listCommentLikes(commentId: string, take = 10): Promise<MinimalUserDTO[]> {
  const res = await fetch(`${COMMENTS_BASE}/${encodeURIComponent(commentId)}/likes?take=${take}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Erro ao listar curtidas do comentário');
  }
  return res.json();
}

/**
 * Verifica se o usuário logado curtiu um comentário.
 * GET /api/comments/:commentId/isLiked
 */
export async function isCommentLiked(commentId: string): Promise<boolean> {
  const res = await fetch(`${COMMENTS_BASE}/${encodeURIComponent(commentId)}/isLiked`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Erro ao verificar curtida do comentário');
  }
  const { liked } = await res.json();
  return liked;
}
