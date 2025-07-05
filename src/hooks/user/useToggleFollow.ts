// src/hooks/useToggleFollow.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postToggleFollow } from '@/api/users';

export function useToggleFollow(username: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => postToggleFollow(username),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', username] });
    },
  });
}
