// File: src/components/client/search/SearchResults.tsx
'use client';

import BookCard from '@components/server/book/BookCard';
import Link     from 'next/link';
import Image    from 'next/image';
import useSearch from '@hooks/useSearch';

import type { BookDTO } from '@models/book.dto';
import type { UserDTO } from '@models/user.dto';

interface Props {
  query: string;
  tab: 'books' | 'users';
}

export default function SearchResults({ query, tab }: Props) {
  const { data, loading, error } = useSearch(query, tab);

  if (!query) return null;
  if (loading) return <p>Carregando...</p>;
  if (error)   return <p>Erro ao buscar.</p>;
  if (!data?.length) return <p>Nenhum resultado encontrado.</p>;

  return (
    <div className="space-y-4 mt-4">
      {tab === 'books' &&
        (data as BookDTO[]).map(book => (
          <BookCard key={book.isbn} book={book} />
        ))
      }

      {tab === 'users' &&
        (data as UserDTO[]).map(user => (
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
        ))
      }
    </div>
  );
}
