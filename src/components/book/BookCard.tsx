'use server';

import clsx from 'clsx';
import BookCover from '@/components/book/BookCover';
import BookInfo from '@/components/book/BookInfo';
import type { BookDTO } from '@/src/hooks/types/book.type';

export default function BookCard({ book, className }: { book: BookDTO; className?: string }) {
  return (
    <article
      className={clsx(
        'flex flex-col gap-5 rounded-md border bg-[var(--surface-card)] p-4 transition-colors hover:bg-[var(--surface-card-hover)] sm:flex-row',
        className,
      )}
    >
      <BookCover book={book} width={120} height={180} />
      <BookInfo book={book} className="gap-1" />
    </article>
  );
}
