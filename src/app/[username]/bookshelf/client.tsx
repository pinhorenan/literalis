// src/app/[username]/bookshelf/client.tsx
'use client';

import React from 'react';
import clsx from 'clsx';
import { useUserShelf } from '@/src/hooks/bookshelf/useUserShelf';
import { useBookData } from '@/src/hooks/book/useBook';
import { BookCard } from '@/src/components/core/Book';
import { Session } from 'next-auth';

interface Props {
  userId: string;
  username: string;
  isOwn: boolean;
}

export default function BookshelfClient({ userId, username, isOwn }: Props) {
  const { data: shelfItems = [], isLoading, error } = useUserShelf(userId);

  if (isLoading) return <p>Carregando estante...</p>;
  if (error) return <p>Erro ao carregar estante.</p>;

  return (
    <main className="p-4">
      <h1 className="mb-6 text-2xl font-bold">
        {isOwn ? 'Minha Estante' : `Estante de ${username}`}
      </h1>

      {shelfItems.length === 0 ? (
        <p>
          {isOwn
            ? 'Sua estante está vazia. Adicione livros para começar!'
            : 'Esta estante está vazia.'}
        </p>
      ) : (
        <div
          className={clsx('grid gap-6', 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4')}
        >
          {shelfItems.map((item) => (
            <ShelfBook key={item.bookIsbn} isbn={item.bookIsbn} />
          ))}
        </div>
      )}
    </main>
  );
}

function ShelfBook({ isbn }: { isbn: string }) {
  const { data: book, isLoading, error } = useBookData(isbn);

  if (isLoading) return <p>Carregando livro...</p>;
  if (error || !book) return <p>Erro ao carregar livro.</p>;

  return <BookCard book={book} />;
}
