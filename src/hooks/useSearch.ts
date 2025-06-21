// File: src/hooks/useSearch.ts
import useSWR from 'swr';
import { SearchService } from '@/src/lib/services/SearchService';
import type { BookDTO } from '@models/book.dto';
import type { UserDTO } from '@models/user.dto';

export default function useSearch(query: string, tab: 'books' | 'users') {
  // O hook pode retornar lista de livros ou de usuários
  type Results = BookDTO[] | UserDTO[];

  const { data, error, isLoading } = useSWR<Results>(
    query ? ['search', query, tab] : null,
    () => SearchService.search(query, tab)
  );

  return {
    data: (data ?? []) as Results,
    error,
    loading: isLoading,
  };
}
