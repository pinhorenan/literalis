// src/services/client/post.client.ts
import type { CreatePostDTO, UpdatePostDTO } from '@models/post.dto';

export const PostClient = {
  async create(userUsername: string, bookIsbn: string, data: CreatePostDTO) {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erro ao criar post');
    return res.json();
  },

  async update(postId: string, data: UpdatePostDTO) {
    const res = await fetch(`/api/posts/${postId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erro ao atualizar post');
    return res.json();
  },

  async delete(postId: string) {
    const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erro ao deletar post');
    return res.json();
  },

  async toggleLike(postId: string, userUsername: string) {
    const res = await fetch(`/api/posts/${postId}/like`, {
      method: 'PATCH',
      body: JSON.stringify({ userUsername }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Erro ao curtir/descurtir');
    return res.json();
  },

  async addComment(postId: string, userUsername: string, content: string) {
    const res = await fetch(`/api/posts/${postId}/comment`, {
      method: 'POST',
      body: JSON.stringify({ userUsername, content }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Erro ao adicionar comentário');
    return res.json();
  },
};
