// src/app/search/page.tsx
'use client';

import useDebounce from '@hooks/search/useDebounce';
import useSearchState from '@hooks/search/useSearchState';
import SearchBar from '@components/client/ui/SearchBar';
import SearchTabs from '@components/client/search/SearchTabs';
import SearchResults from '@components/client/search/SearchResults';

export default function Search() {
  const { query, setQuery, tab, setTab } = useSearchState();
  const debouncedQuery = useDebounce(query, 300);

  return (
    <section className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <SearchBar value={query} onChange={setQuery} />
      <SearchTabs selected={tab} onSelect={setTab} />
      <SearchResults query={debouncedQuery} tab={tab} />
    </section>
  );
}
