// src/hooks/useUpdatePost.ts
'use client';

import { useState } from 'react';
import { PostClient } from '@services/client/post.client';
import type { UpdatePostDTO, PostDTO } from '@/src/models/post.model';

export function useUpdatePost(postId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updatePost(data: UpdatePostDTO): Promise<PostDTO | null> {
    setLoading(true);
    setError(null);
    try {
      return await PostClient.update(postId, data);
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar post');
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { updatePost, loading, error };
}
