// src/components/client/search/SearchResults.tsx
'use client';

import BookCard from '@components/server/book/BookCard';
import Link from 'next/link';
import Image from 'next/image';

import useBookSearch from '@hooks/search/useBookSearch';
import useUserSearch from '@hooks/search/useUserSearch';

interface Props {
  query: string;
  tab: 'books' | 'users';
}

export default function SearchResults({ query, tab }: Props) {
  const {
    books,
    isLoading: loadingBooks,
    error: errorBooks,
  } = useBookSearch(query);

  const {
    users,
    isLoading: loadingUsers,
    error: errorUsers,
  } = useUserSearch(query);

  const loading = tab === 'books' ? loadingBooks : loadingUsers;
  const error = tab === 'books' ? errorBooks : errorUsers;

  if (!query.trim()) return null;
  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao buscar.</p>;

  const hasNoResults =
    (tab === 'books' && books.length === 0) ||
    (tab === 'users' && users.length === 0);

  if (hasNoResults) return <p>Nenhum resultado encontrado.</p>;

  return (
    <div className="space-y-4 mt-4">
      {tab === 'books' &&
        books.map(book => (
          <BookCard key={book.isbn} book={book} />
        ))}

      {tab === 'users' &&
        users.map(user => (
          <Link
            key={user.username}
            href={`/profile/${user.username}`}
            className="flex items-center gap-3"
          >
            <Image
              src={user.avatarUrl}
              alt={user.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <span>{user.name}</span>
          </Link>
        ))}
    </div>
  );
}
