// src/clients/commentClient.ts
import { CommentDTO } from '@models/comment.model';
const POSTS_BASE = '/api/posts';

/**
 * Lista comentários de um post, em ordem cronológica.
 * GET /api/posts/:postId/comments?take=&cursor=
 */
export async function listComments(
  postId: string,
  take = 20,
  cursor?: string,
): Promise<CommentDTO[]> {
  const params = new URLSearchParams({ take: String(take) });
  if (cursor) params.set('cursor', cursor);

  const res = await fetch(
    `${POSTS_BASE}/${encodeURIComponent(postId)}/comments?${params.toString()}`,
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Erro ao listar comentários');
  }
  return res.json();
}

/**
 * Adiciona um comentário a um post.
 * POST /api/posts/:postId/comments
 */
export async function addComment(postId: string, content: string): Promise<CommentDTO> {
  const res = await fetch(`${POSTS_BASE}/${encodeURIComponent(postId)}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Erro ao adicionar comentário');
  }
  return res.json();
}

/**
 * Edita o conteúdo de um comentário.
 * PATCH /api/comments/:commentId
 */
export async function editComment(commentId: string, content: string): Promise<CommentDTO> {
  const res = await fetch(`/api/comments/${encodeURIComponent(commentId)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Erro ao editar comentário');
  }
  return res.json();
}

/**
 * Remove (soft-delete) um comentário.
 * DELETE /api/comments/:commentId
 */
export async function deleteComment(commentId: string): Promise<void> {
  const res = await fetch(`/api/comments/${encodeURIComponent(commentId)}`, { method: 'DELETE' });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Erro ao remover comentário');
  }
}
