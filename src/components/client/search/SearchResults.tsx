// src/components/client/search/SearchResults.tsx
'use client';

import BookSearchResult from './partials/BookSearchResult';
import UserSearchResult from './partials/UserSearchResult';
import useBookSearch from '@/src/hooks/search/useSearchBook';
import useUserSearch from '@/src/hooks/search/useSearchUser';

interface Props {
  query: string;
  tab: 'books' | 'users';
}

export default function SearchResults({ query, tab }: Props) {
  const activeQuery = query.trim();

  const {
    books = [],
    isLoading: loadingBooks,
    error: errorBooks,
  } = useBookSearch(tab === 'books' ? activeQuery : '');

  const {
    users = [],
    isLoading: loadingUsers,
    error: errorUsers,
  } = useUserSearch(tab === 'users' ? activeQuery : '');

  const loading = tab === 'books' ? loadingBooks : loadingUsers;
  const error = tab === 'books' ? errorBooks : errorUsers;

  if (!activeQuery) return null;
  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao buscar.</p>;

  const hasNoResults =
    (tab === 'books' && books.length === 0) ||
    (tab === 'users' && users.length === 0);

  if (hasNoResults) {
    return <p>Nenhum resultado encontrado para “{query}”.</p>;
  }

  return (
    <div className="space-y-4 mt-4">
      {tab === 'books' && <BookSearchResult books={books} />}
      {tab === 'users' && (
        <UserSearchResult users={users as any /* ← solução temporária */} />
      )}
    </div>
  );
}
