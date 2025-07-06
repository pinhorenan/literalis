'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchUserShelf } from '@/api/bookshelf';
import type { Paginated, ShelfItem } from '@/types/index';

type ShelfPage = Paginated<ShelfItem>;

export interface ShelfFilters {
  query?: string;
  status?: string;
}

/**
 * Obtém a estante de um usuário, com paginação por cursor e filtros opcionais.
 *
 * @param username   usuário dono da estante
 * @param cursor     cursor da página atual (undefined = primeira)
 * @param take       itens por página (default 20)
 * @param filters    objeto com `query` (busca textual) e/ou `status`
 */
export function useUserShelf(
  username: string,
  cursor: string | undefined,
  take = 20,
  filters: ShelfFilters = {},
) {
  return useQuery<ShelfPage>({
    queryKey: ['shelf', username, cursor, take, filters],
    queryFn: () => fetchUserShelf(username, cursor, take, filters),
    placeholderData: (previous) => previous,
    enabled: Boolean(username),
    staleTime: 5 * 60 * 1000,
  });
}
