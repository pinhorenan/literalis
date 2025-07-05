// src/hooks/useUserProfile.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchUserProfile } from '@/api/users';
import type { UserProfile } from '@/types/user';

export function useUserProfile(username: string) {
  return useQuery<UserProfile, Error>({
    queryKey: ['user', username],
    queryFn: () => fetchUserProfile(username),
    staleTime: 1000 * 60,
    retry: 1,
  });
}
