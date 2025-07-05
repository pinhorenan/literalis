// src/hooks/post/useCommentPost.ts
'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commentPost } from '@/api/posts';
import type { Comment } from '@/types/post';

export function useCommentPost(id: string) {
  const qc = useQueryClient();
  return useMutation<Comment, Error, string>({
    mutationFn: (content) => commentPost(id, content),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['post', id] });
    },
  });
}
