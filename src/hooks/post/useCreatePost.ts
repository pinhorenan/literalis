// src/hooks/post/useCreatePost.ts
'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/api/posts';
import type { Post } from '@/types/post';

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation<Post, Error, Parameters<typeof api.createPost>[0]>({
    mutationFn: (data) => api.createPost(data),
    onSuccess: (_newPost, _vars) => {
      qc.invalidateQueries({ queryKey: ['posts', 'feed'] });
      qc.invalidateQueries({ queryKey: ['posts', 'user'] });
    },
  });
}
