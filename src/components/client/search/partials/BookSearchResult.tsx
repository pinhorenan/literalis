// src/components/client/search/partials/BookSearchResult.tsx
'use client';

import BookCard from '@components/server/book/BookCard';
import type { BookDTO } from '@models/book.dto';

export default function BookSearchResult({ books }: { books: BookDTO[] }) {
  return (
    <>
      {books.map(book => (
        <BookCard key={book.isbn} book={book} />
      ))}
    </>
  );
}
