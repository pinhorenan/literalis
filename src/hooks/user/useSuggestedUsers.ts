// src/hooks/user/useSuggestedUsers.ts
'use client';
import { useQuery } from '@tanstack/react-query';
import type { MinimalUser } from '@/types/user';

export function useSuggestedUsers(limit = 5) {
  return useQuery<MinimalUser[], Error>({
    queryKey: ['suggestedUsers', limit],
    queryFn: async () => {
      const res = await fetch(`/api/users/suggestions?limit=%{limit}`);
      if (!res.ok) throw new Error('Erro ao buscar sugestões.');
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
