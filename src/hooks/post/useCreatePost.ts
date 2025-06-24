// src/hooks/useCreatePost.ts
'use client';

import { useState } from 'react';
import { PostClient } from '@services/client/post.client';
import type { CreatePostDTO, PostDTO } from '@/src/models/post.model';

export function useCreatePost() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createPost(data: CreatePostDTO): Promise<PostDTO | null> {
    setLoading(true);
    setError(null);
    try {
      return await PostClient.create(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar post');
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { createPost, loading, error };
}
