// src/hooks/useUserProfile.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchUserProfile, UserProfileResponse } from '@/src/data/api/users';

export function useUserProfile(username: string) {
  return useQuery<UserProfileResponse>({
    queryKey: ['user', username],
    queryFn: () => fetchUserProfile(username),
    retry: 1,
    staleTime: 1000 * 60, // 1 minuto
  });
}
