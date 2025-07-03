import type { BookDTO } from '@/src/hooks/types/book.type';
import clsx from 'clsx';

export default function BookInfo({ book, className }: { book: BookDTO; className?: string }) {
  return (
    <div className={clsx('flex flex-col', className)}>
      <h3 className="text-lg font-semibold text-[var(--text-primary)]">{book.title}</h3>
      <p className="text-sm text-[var(--text-secondary)]">por {book.authors}</p>

      {(book.publisher || book.edition) && (
        <p className="text-xs text-[var(--text-tertiary)]">
          {book.publisher}
          {book.publisher && book.edition ? ', ' : ''}
          {book.edition && `ed. ${book.edition}`}
        </p>
      )}

      {(book.pages || book.language) && (
        <p className="text-xs text-[var(--text-tertiary)]">
          {book.pages && `${book.pages} páginas`}
          {book.pages && book.language ? ' • ' : ''}
          {book.language}
        </p>
      )}

      <p className="text-sm text-[var(--text-secondary)]">ISBN: {book.isbn}</p>
    </div>
  );
}
