// src/hooks/bookshelf/useShelfCount.ts
'use client';

import { useQuery } from '@tanstack/react-query';

export function useShelfCount(username: string) {
  return useQuery<{ books: number }, Error>({
    queryKey: ['shelf-count', username] as const,
    queryFn: async () => {
      const res = await fetch(`/api/users/${username}/bookshelf/count`).then((r) => r.json());
      return res as { books: number };
    },
    enabled: !!username,
    staleTime: 5 * 60 * 1000,
  });
}
