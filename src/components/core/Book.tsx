// src/components/core/Book.tsx
import clsx from 'clsx';
import Image from 'next/image';
import type { Book, MinimalBook } from '@/types/book';

interface BookCoverProps {
  book: MinimalBook;
  width?: number;
  height?: number;
  inShelf?: boolean;
  className?: string;
}

export function BookCover({ book, width = 120, height = 180, className = '' }: BookCoverProps) {
  return (
    <div className={`relative ${className}`}>
      <Image
        src={book.coverUrl || '/uploads/covers/default.jpg'}
        alt={`Capa do livro ${book.title}`}
        width={width}
        height={height}
        className="border-accent h-full w-full rounded-lg border object-contain shadow-sm"
        loading="eager"
      />
    </div>
  );
}

export function BookInfo({ book, className }: { book: Book; className?: string }) {
  return (
    <div className={clsx('flex flex-col', className)}>
      <h3 className="text-primary text-lg font-semibold">{book.title}</h3>
      <p className="text-secondary text-sm">por {book.authors[0].name}</p>

      {book.publisher && <p className="text-tertiary text-xs">{book.publisher.name}</p>}

      {(book.totalPages || book.language) && (
        <p className="text-tertiary text-xs">
          {book.totalPages && `${book.totalPages} páginas`}
          {book.totalPages && book.language ? ' • ' : ''}
          {book.language}
        </p>
      )}

      <p className="text-secondary text-sm">ISBN: {book.isbn}</p>
    </div>
  );
}

export function BookCard({ book, className }: { book: Book; className?: string }) {
  return (
    <article
      className={clsx(
        'bg-card hover:bg-card-hover flex flex-col gap-5 rounded-md border p-4 transition-colors sm:flex-row',
        className,
      )}
    >
      <BookCover book={book} width={120} height={180} />
      <BookInfo book={book} className="gap-1" />
    </article>
  );
}
