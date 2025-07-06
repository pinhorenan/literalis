// src/components/core/Book.tsx
import clsx from 'clsx';
import Image from 'next/image';
import { useBook } from '@/hooks/book/useBook';

interface BookCoverProps {
  isbn: string;
  width?: number;
  height?: number;
  inShelf?: boolean;
  className?: string;
}

export function BookCover({ isbn, width = 120, height = 180, className = '' }: BookCoverProps) {
  const { data: book, isLoading } = useBook(isbn);

  return (
    <div className={`relative overflow-hidden shadow-sm ${className}`} style={{ width, height }}>
      {isLoading || !book ? (
        <div className="skeleton-shimmer absolute inset-0" />
      ) : (
        <div className={`relative aspect-[2/3] w-[${width}] overflow-hidden rounded-lg`}>
          <Image
            src={book.coverUrl || '/uploads/covers/default.jpg'}
            alt={`Capa do livro ${book.title}`}
            fill
            sizes="120px"
            className="rounded-lg border object-cover"
            priority
          />
        </div>
      )}
    </div>
  );
}

export function BookInfo({ isbn, className }: { isbn: string; className?: string }) {
  const { data: book } = useBook(isbn);
  if (!book) return null;

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

export function BookCard({ isbn, className }: { isbn: string; className?: string }) {
  return (
    <article
      className={clsx(
        'bg-card hover:bg-card-hover flex flex-col gap-5 rounded-md border p-4 transition-colors sm:flex-row',
        className,
      )}
    >
      <BookCover isbn={isbn} width={120} height={180} />
      <BookInfo isbn={isbn} className="gap-1" />
    </article>
  );
}

export function BookTile({ isbn }: { isbn: string }) {
  const { data: book } = useBook(isbn);
  if (!book) return null;

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <BookCover isbn={isbn} width={96} height={144} />
      <p className="line-clamp-2 text-sm font-medium">{book.title}</p>
      <p className="text-muted-foreground line-clamp-1 text-xs">{book.authors[0]?.name}</p>
    </div>
  );
}
