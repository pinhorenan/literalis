// src/hooks/useToggleFollow.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postToggleFollow } from '@/api/users';

export function useToggleFollow(username: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => postToggleFollow(username),

    onSuccess: () => {
      // Invalidar todas as queries relacionadas ao usuário para sincronizar estado
      queryClient.invalidateQueries({ queryKey: ['user', username] });
      queryClient.invalidateQueries({ queryKey: ['followers', username] });
      queryClient.invalidateQueries({ queryKey: ['following', username] });
      // Também invalidar sugestões para atualizar a lista
      queryClient.invalidateQueries({ queryKey: ['suggested-users'] });
    },
  });
}
