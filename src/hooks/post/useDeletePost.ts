// src/hooks/post/useDeletePost.ts
'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePost } from '@/api/posts';

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (postId) => deletePost(postId),
    onSuccess: (_data, postId) => {
      qc.invalidateQueries({ queryKey: ['posts', 'feed'] });
      qc.invalidateQueries({ queryKey: ['posts', 'user'] });
      qc.removeQueries({ queryKey: ['post', postId] });
    },
  });
}
