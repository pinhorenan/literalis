// src/hooks/post/useLikePost.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/api/posts';

export function useToggleLikePost(id: string) {
  const qc = useQueryClient();
  return useMutation<{ liked: boolean; likesCount: number }, Error, void>({
    mutationFn: () => api.toggleLikePost(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['post', id] });
    },
  });
}
