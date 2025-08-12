// src/hooks/post/useCreatePost.ts
'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from '@/api/posts';
import type { Post } from '@/types/post';

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation<Post, Error, Parameters<typeof createPost>[0]>({
    mutationFn: (data) => createPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['posts', 'feed'] });
      qc.invalidateQueries({ queryKey: ['posts', 'user'] });
    },
  });
}
