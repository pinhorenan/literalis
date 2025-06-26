// src/hooks/useFollow.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import {
  listFollowers,
  listFollowing,
  toggleFollow,
  ToggleFollowResponse,
} from '@clients/follow.client';
import type { MinimalUserDTO } from '@models/user.model';

const QUERY_KEY_FOLLOWERS = (username: string) => ['follow', 'followers', username] as const;
const QUERY_KEY_FOLLOWING = (username: string) => ['follow', 'following', username] as const;

/**
 * Hook para buscar quem segue o usuário dado.
 */
export function useFollowers(
  username: string,
  options?: Omit<
    UseQueryOptions<
      MinimalUserDTO[],
      Error,
      MinimalUserDTO[],
      ReturnType<typeof QUERY_KEY_FOLLOWERS>
    >,
    'queryKey' | 'queryFn'
  >,
) {
  const key = QUERY_KEY_FOLLOWERS(username);
  return useQuery<MinimalUserDTO[], Error, MinimalUserDTO[], typeof key>({
    queryKey: key,
    queryFn: () => listFollowers(username),
    staleTime: 1000 * 60 * 5, // cache por 5min
    ...options,
  });
}

/**
 * Hook para buscar quem o usuário dado está seguindo.
 */
export function useFollowing(
  username: string,
  options?: Omit<
    UseQueryOptions<
      MinimalUserDTO[],
      Error,
      MinimalUserDTO[],
      ReturnType<typeof QUERY_KEY_FOLLOWING>
    >,
    'queryKey' | 'queryFn'
  >,
) {
  const key = QUERY_KEY_FOLLOWING(username);
  return useQuery<MinimalUserDTO[], Error, MinimalUserDTO[], typeof key>({
    queryKey: key,
    queryFn: () => listFollowing(username),
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}

/**
 * Hook para alternar follow/unfollow de um usuário alvo.
 *
 * Variável de mutate: o username alvo (string).
 */
export function useToggleFollow(options?: UseMutationOptions<ToggleFollowResponse, Error, string>) {
  const qc = useQueryClient();
  return useMutation<ToggleFollowResponse, Error, string>({
    mutationFn: (targetUsername) => toggleFollow(targetUsername),
    ...options,
    onSuccess(data, targetUsername, context) {
      // Invalida os seguidores do alvo para refetch automático
      qc.invalidateQueries({ queryKey: QUERY_KEY_FOLLOWERS(targetUsername) });
      // Encadeia callback onSuccess do usuário, se houver
      options?.onSuccess?.(data, targetUsername, context);
    },
  });
}
