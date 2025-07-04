// src/hooks/useToggleFollow.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postToggleFollow } from '@/src/api/users';

export function useToggleFollow(username: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => postToggleFollow(username),
    onSuccess: () => {
      // invalida apenas a query de perfil desse username
      queryClient.invalidateQueries({ queryKey: ['user', username] });
    },
  });
}
