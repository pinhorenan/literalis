// src/hooks/useSearch.ts
import useSWR from 'swr';
import { SearchService } from '@services/SearchService';

export default function useSearch(query: string, tab: 'books' | 'users') {
  const { data, error, isLoading } = useSWR(
    query ? ['search', query, tab] : null,
    () => SearchService.search(query, tab)
  );
  return { data: data ?? [], error, loading: isLoading };
}
