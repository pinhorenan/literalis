// File: src/components/server/book/BookInfo.tsx
import type { BookDTO } from '@models/book.dto';
import clsx from 'clsx';

export default function BookInfo({ book, className }: { book: BookDTO; className?: string }) {
  return (
    <div className={clsx('flex flex-col', className)}>
      <h3 className="text-lg text-[var(--text-primary)]">{book.title}</h3>
      <p className="text-sm text-[var(--text-secondary)]">por {book.author}</p>
      <p className="text-xs text-[var(--text-tertiary)]">
        {book.publisher}, ed. {book.edition}
      </p>
      <p className="text-xs text-[var(--text-tertiary)]">
        {book.pages} páginas • {book.language}
      </p>
      <p className="text-sm text-[var(--text-secondary)]">ISBN: {book.isbn}</p>
    </div>
  );
}
