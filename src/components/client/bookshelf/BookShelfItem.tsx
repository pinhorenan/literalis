// File: src/components/client/bookshelf/BookShelfItem.tsx
'use client';

import React from 'react';
import OptionsMenu          from '@components/client/ui/OptionsMenu';
import BookCover            from '@components/server/book/BookCover';
import BookInfo             from '@components/server/book/BookInfo';
import type { UserBookDTO } from '@models/userBook.dto';

interface ShelfItemProps {
  item: UserBookDTO;
  viewMode: 'grid' | 'list';
  isOwner: boolean;
  onEdit: (isbn: string, oldPct: number) => void;
  onDelete: (isbn: string) => void;
  className?: string;
}

export default function ShelfItem({
  item,
  viewMode,
  isOwner,
  onEdit,
  onDelete,
  className = '',
}: ShelfItemProps) {
  const { book, progressPages, progressPct } = item;

  const ProgressBar = (
    <div className="w-full h-2 bg-[var(--color-secondary)] border border-[var(--border-base)] rounded overflow-hidden">
      <div
        className="h-full bg-[var(--color-primary)] transition-all duration-300"
        style={{ width: `${progressPct}%` }}
      />
    </div>
  );

  if (viewMode === 'grid') {
    return (
      <div className={`relative group w-full max-w-[180px] mx-auto ${className}`}>
        <BookCover
          book={book}
          width={180}
          className="w-full h-auto rounded-xl border border-[var(--border-subtle)] shadow-sm transition-transform duration-200 transform group-hover:scale-105"
        />

        <div className="absolute bottom-2 left-2 right-2 text-center">
          {ProgressBar}
        </div>

        {isOwner && (
          <div className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <OptionsMenu
              onEdit={() => onEdit(book.isbn, progressPages)}
              onDelete={() => onDelete(book.isbn)}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center px-4 py-3 rounded-xl
        border border-[var(--border-subtle)] bg-[var(--surface-card)]
        shadow-sm transition hover:bg-[var(--surface-card-hover)] ${className}`}
    >
      <BookCover
        book={book}
        width={120}
        className="rounded-md border border-[var(--border-base)] shadow-sm"
      />

      <div className="ml-4 flex-1">
        <BookInfo book={book} className="text-sm" />

        <div className="mt-2">
          {ProgressBar}
          <div className="text-xs text-right text-[var(--text-secondary)] mt-1">
            {progressPct}% lido
          </div>
        </div>
      </div>

      {isOwner && (
        <div className="absolute top-2 right-2 z-10">
          <OptionsMenu
            onEdit={() => onEdit(book.isbn, progressPages)}
            onDelete={() => onDelete(book.isbn)}
          />
        </div>
      )}
    </div>
  );
}
