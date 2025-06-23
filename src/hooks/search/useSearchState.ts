// src/hooks/search/useSearchState.ts
'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';

export default function useSearchState() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const query = params.get('q') ?? '';
  const tab = (params.get('tab') === 'users' ? 'users' : 'books') as 'books' | 'users';

  const setQuery = useCallback((newQuery: string) => {
    const next = new URLSearchParams(params.toString());
    next.set('q', newQuery);
    router.push(`${pathname}?${next.toString()}`);
  }, [params, pathname, router]);

  const setTab = useCallback((newTab: 'books' | 'users') => {
    const next = new URLSearchParams(params.toString());
    next.set('tab', newTab);
    router.push(`${pathname}?${next.toString()}`);
  }, [params, pathname, router]);

  return { query, tab, setQuery, setTab };
}
