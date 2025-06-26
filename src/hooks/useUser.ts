// src/hooks/useUser.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { getUserByUsername, updateUser } from '@clients/user.client';
import type { UserDTO, UserUpdateDTO } from '@models/user.model';

const QUERY_KEY_USER = (username: string) => ['user', username] as const;

export function useUser(
  username: string,
  options?: Omit<
    UseQueryOptions<UserDTO, Error, UserDTO, readonly ['user', string]>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery<UserDTO, Error, UserDTO, readonly ['user', string]>({
    queryKey: QUERY_KEY_USER(username),
    queryFn: () => getUserByUsername(username),
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}

export function useUpdateUser(
  username: string,
  options?: UseMutationOptions<UserDTO, Error, UserUpdateDTO>,
) {
  const qc = useQueryClient();

  return useMutation<UserDTO, Error, UserUpdateDTO>({
    mutationFn: (data) => updateUser(username, data),
    ...options,
    onSuccess(data, variables, context) {
      // invalida o cache do usuário para refetch
      qc.invalidateQueries({ queryKey: QUERY_KEY_USER(username) });
      options?.onSuccess?.(data, variables, context);
    },
  });
}
