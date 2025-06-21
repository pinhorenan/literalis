// File: src/components/server/book/BookCard.tsx

import BookCover from '@components/server/book/BookCover';
import BookInfo  from '@components/server/book/BookInfo';
import type { BookDTO } from '@models/book.dto';

export default function BookCard({ book, className }: { book: BookDTO, className?: string }) {
  return (
    <div className={`flex gap-5 p-4 rounded-md border bg-[var(--surface-card)] hover:bg-[var(--surface-card-hover)] transition-colors ${className}`}>
      <BookCover book={book} width={120} height={180} />

      <BookInfo book={book} className="gap-1" />
    </div>
  );
}
