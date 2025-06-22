// src/services/client/post.service.ts
import type { CommentDTO } from '@models/comment.dto';
import type { PostDTO, UpdatePostDTO, CreatePostDTO } from '@models/post.dto';

export async function fetchPosts(params?: { authorUsername?: string; onlyFollowing?: boolean }): Promise<PostDTO[]> {
  const query = new URLSearchParams();

  if (params?.authorUsername) query.append('author', params.authorUsername);
  if (params?.onlyFollowing)  query.append('following', 'true');

  const res = await fetch(`/api/posts?${query.toString()}`);

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Erro ao buscar posts');
  }

  return res.json();
}

export async function createPostRequest(data: CreatePostDTO) {
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) throw new Error('Falha ao criar post');
  return (await res.json());
}

export async function deletePostRequest(postId: string) {
  const res = await fetch(`/api/posts/${postId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  
  if (!res.ok) throw new Error('Falha ao remover post');
  return (await res.json());
}

export async function updatePostRequest(postId: string, data: UpdatePostDTO) {
  const res = await fetch(`/api/posts/${postId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) throw new Error('Falha ao atualizar post');
  return (await res.json());
}

export async function toggleLikeRequest(postId: string) {
  const res = await fetch(`/api/posts/${postId}/like`, {
    method: 'PATCH',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Falha ao alternar like');
  return (await res.json()) as { liked: boolean; likeCount: number };
}

export async function createCommentRequest(postId: string, content: string): Promise<CommentDTO> {
  const res = await fetch(`/api/posts/${postId}/comments`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error('Falha ao criar comentário');
  return await res.json();
}