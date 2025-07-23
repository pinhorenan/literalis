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
    <div 
      className={`relative overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`} 
      style={{ width, height }}
    >
      {isLoading || !book ? (
        <div className="skeleton-shimmer absolute inset-0 rounded-lg border bg-gradient-to-br from-muted via-muted/80 to-muted animate-pulse" />
      ) : (
        <div className="relative aspect-[2/3] border overflow-hidden rounded-lg group">
          <Image
            src={book.coverUrl}
            alt={`Capa do livro ${book.title}`}
            fill
            sizes="120px"
            className="rounded-lg border object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-lg" />
        </div>
      )}
    </div>
  );
}

export function BookInfo({ isbn, className }: { isbn: string; className?: string }) {
  const { data: book } = useBook(isbn);
  if (!book) return null;

  return (
    <div className={clsx('flex flex-col space-y-1', className)}>
      <h3 className="text-primary text-base font-semibold leading-tight hover:text-primary/80 transition-colors cursor-pointer">
        {book.title}
      </h3>
      <p className="text-muted-foreground text-sm font-medium">
        por {book.authors[0].name}
      </p>

      {book.publisher && (
        <p className="text-muted-foreground text-xs">
          {book.publisher.name}
        </p>
      )}

      {(book.totalPages || book.language) && (
        <p className="text-muted-foreground text-xs flex items-center gap-1">
          {book.totalPages && (
            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium">
              {book.totalPages} páginas
            </span>
          )}
          {book.totalPages && book.language && <span>•</span>}
          {book.language && (
            <span className="bg-secondary/10 text-secondary px-2 py-0.5 rounded-full text-xs font-medium">
              {book.language}
            </span>
          )}
        </p>
      )}

      <p className="text-muted-foreground text-xs font-mono bg-muted/50 px-2 py-1 rounded">
        ISBN: {book.isbn}
      </p>
    </div>
  );
}

export function BookCard({ isbn, className }: { isbn: string; className?: string }) {
  return (
    <article
      className={clsx(
        'bg-card hover:bg-card-hover flex flex-col gap-4 rounded-lg border p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-1 sm:flex-row sm:gap-6',
        className,
      )}
    >
      <div className="flex-shrink-0">
        <BookCover isbn={isbn} width={120} height={180} />
      </div>
      <BookInfo isbn={isbn} className="flex-1" />
    </article>
  );
}

export function BookTile({ isbn }: { isbn: string }) {
  const { data: book } = useBook(isbn);
  if (!book) return null;

  return (
    <div className="flex flex-col items-center gap-2 text-center group cursor-pointer">
      <div className="relative">
        <BookCover
          isbn={isbn}
          className="transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-lg"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 rounded-lg" />
      </div>
      <div className="space-y-1 w-full">
        <p className="line-clamp-2 text-sm font-semibold leading-tight group-hover:text-primary transition-colors">
          {book.title}
        </p>
        <p className="text-muted-foreground line-clamp-1 text-xs font-medium">
          {book.authors[0]?.name}
        </p>
        <div className="bg-muted/50 rounded-full px-2 py-1">
          <p className="text-xs text-muted-foreground font-medium">progresso (todo)</p>
        </div>
      </div>
    </div>
  );
}
