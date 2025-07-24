// src/components/onboarding/PopularBooks.tsx
'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookCover } from '@/components/core/Book';
import { useAllBooks } from '@/hooks/book';
import type { MinimalBook } from '@/types/book';

interface PopularBooksProps {
  onBooksSelected: (books: string[]) => void;
  selectedBooks: string[];
}

export function PopularBooks({ onBooksSelected, selectedBooks }: PopularBooksProps) {
  const { data: books = [], isLoading } = useAllBooks();

  // Pegar apenas os primeiros 12 livros como "populares"
  const popularBooks = books.slice(0, 12);

  const toggleBook = (isbn: string) => {
    if (selectedBooks.includes(isbn)) {
      onBooksSelected(selectedBooks.filter((book) => book !== isbn));
    } else {
      onBooksSelected([...selectedBooks, isbn]);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="space-y-2 text-center">
          <h3 className="text-lg font-semibold">Carregando livros populares...</h3>
          <p className="text-muted-foreground text-sm">
            Aguarde enquanto preparamos algumas sugestões para você
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="animate-pulse space-y-2">
              <div className="bg-muted aspect-[2/3] w-full rounded-lg" />
              <div className="bg-muted mx-auto h-3 w-3/4 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h3 className="text-lg font-semibold">Adicione alguns livros à sua estante</h3>
        <p className="text-muted-foreground text-sm">
          Selecione livros que você já leu, está lendo ou tem interesse. Isso nos ajudará a
          personalizar suas recomendações.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {popularBooks.map((book, index) => (
          <BookCard
            key={book.isbn}
            book={book}
            isSelected={selectedBooks.includes(book.isbn)}
            onToggle={() => toggleBook(book.isbn)}
            delay={index * 50}
          />
        ))}
      </div>

      {selectedBooks.length > 0 && (
        <div className="animate-in fade-in text-center duration-300">
          <p className="text-muted-foreground text-sm">
            {selectedBooks.length}{' '}
            {selectedBooks.length === 1 ? 'livro selecionado' : 'livros selecionados'}
          </p>
        </div>
      )}
    </div>
  );
}

function BookCard({
  book,
  isSelected,
  onToggle,
  delay = 0,
}: {
  book: MinimalBook;
  isSelected: boolean;
  onToggle: () => void;
  delay?: number;
}) {
  return (
    <Card
      className={`group relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${isSelected ? 'ring-primary bg-primary/5 ring-2' : 'hover:bg-muted/30'} animate-in slide-in-from-bottom-4 duration-500`}
      style={{ animationDelay: `${delay}ms` }}
      onClick={onToggle}
    >
      <div className="space-y-2 p-3">
        <div className="relative">
          <BookCover
            isbn={book.isbn}
            width={120}
            height={180}
            className="mx-auto transition-transform group-hover:scale-105"
          />
          {isSelected && (
            <div className="bg-primary animate-in zoom-in-75 absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full duration-200">
              <Check className="text-primary-foreground h-4 w-4" />
            </div>
          )}
        </div>
        <div className="space-y-1 text-center">
          <p className="line-clamp-2 text-xs font-medium leading-tight">{book.title}</p>
          <p className="text-muted-foreground line-clamp-1 text-xs">{book.authors?.[0]?.name}</p>
        </div>
      </div>
    </Card>
  );
}
