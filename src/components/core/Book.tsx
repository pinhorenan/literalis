// src/components/core/Book.tsx
import clsx from 'clsx';
import Image from 'next/image';
import { useBook } from '@/hooks/book/useBook';
import type { Book, MinimalBook } from '@/types/book';

interface BookCoverProps {
  isbn: string;
  width?: number;
  height?: number;
  inShelf?: boolean;
  className?: string;
  // When true, the cover scales fluidly to its container using aspect ratio
  fluid?: boolean;
  // Opcional: dados já carregados para evitar fetch extra
  book?: Pick<MinimalBook, 'isbn' | 'coverUrl'> & { title?: string };
}

export function BookCover({
  isbn,
  width = 120,
  height = 180,
  className = '',
  fluid = false,
  book: preloaded,
}: BookCoverProps) {
  const { data: fetchedBook, isLoading } = useBook(isbn, { enabled: !preloaded });
  const cover = fetchedBook ?? preloaded;

  return (
    <div
      className={`relative overflow-hidden shadow-sm transition-shadow duration-300 hover:shadow-md ${className} ${
        fluid ? 'aspect-[2/3] w-full' : ''
      }`}
      style={fluid ? undefined : { width, height }}
    >
      {!preloaded && (isLoading || !cover) ? (
        <div className="skeleton absolute inset-0 rounded-lg border" />
      ) : (
        <div className="group relative aspect-[2/3] overflow-hidden rounded-lg border">
          <Image
            src={cover!.coverUrl}
            alt={`Capa do livro ${fetchedBook?.title ?? preloaded?.title ?? 'Livro'}`}
            fill
            sizes={
              fluid
                ? '(min-width: 1536px) 10vw, (min-width: 1280px) 12vw, (min-width: 1024px) 14vw, (min-width: 640px) 18vw, 40vw'
                : '120px'
            }
            className="rounded-lg border object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 rounded-lg bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
        </div>
      )}
    </div>
  );
}

export function BookInfo({
  isbn,
  className,
  book: preloaded,
}: {
  isbn: string;
  className?: string;
  book?: Book;
}) {
  const { data: fetchedBook } = useBook(isbn, { enabled: !preloaded });
  const book = preloaded ?? fetchedBook;
  if (!book) return null;

  return (
    <div className={clsx('flex flex-col space-y-1', className)}>
      <h3 className="text-primary hover:text-primary/80 cursor-pointer text-base font-semibold leading-tight transition-colors">
        {book.title}
      </h3>
      <p className="text-muted-foreground text-sm font-medium">por {book.authors[0].name}</p>
      {(book.totalPages || book.language) && (
        <p className="text-muted-foreground flex items-center gap-1 text-xs">
          {book.totalPages && (
            <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium">
              {book.totalPages} páginas
            </span>
          )}
          {book.totalPages && book.language && <span>•</span>}
          {book.language && (
            <span className="bg-secondary/10 text-secondary rounded-full px-2 py-0.5 text-xs font-medium">
              {book.language}
            </span>
          )}
        </p>
      )}
      <p className="text-muted-foreground bg-muted/50 rounded px-2 py-1 font-mono text-xs">
        ISBN: {book.isbn}
      </p>
    </div>
  );
}

export function BookCard({ isbn, className }: { isbn: string; className?: string }) {
  return (
    <article
      className={clsx(
        'bg-card hover:bg-card-hover flex flex-col gap-4 rounded-lg border p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:flex-row sm:gap-6',
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
    <div className="group flex cursor-pointer flex-col items-center gap-2 text-center">
      <div className="relative">
        <BookCover
          isbn={isbn}
          className="transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-lg"
        />
        <div className="absolute inset-0 rounded-lg bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
      </div>
      <div className="w-full space-y-1">
        <p className="group-hover:text-primary line-clamp-2 text-sm font-semibold leading-tight transition-colors">
          {book.title}
        </p>
        <p className="text-muted-foreground line-clamp-1 text-xs font-medium">
          {book.authors[0]?.name}
        </p>
        <div className="bg-muted/50 rounded-full px-2 py-1">
          <p className="text-muted-foreground text-xs font-medium">progresso (todo)</p>
        </div>
      </div>
    </div>
  );
}
