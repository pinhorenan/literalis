// src/hooks/post/useCommentPost.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/api/posts';
import type { Comment } from '@/types/post';

export function useCommentPost(id: string) {
  const qc = useQueryClient();
  return useMutation<Comment, Error, string>({
    mutationFn: (content) => api.commentPost(id, content),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['post', id] });
    },
  });
}
