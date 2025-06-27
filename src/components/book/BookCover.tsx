'use server';

import Image from 'next/image';
import { Check } from 'lucide-react';
import type { BookDTO } from '@/src/models/bookModels';

interface Props {
  book: BookDTO;
  width?: number;
  height?: number;
  inShelf?: boolean;
  className?: string;
}

export default function BookCover({
  book,
  inShelf = false,
  width = 120,
  height = 180,
  className = '',
}: Props) {
  return (
    <div className={`relative ${className}`}>
      <Image
        src={book.coverUrl || '/images/book-placeholder.png'}
        alt={`Capa do livro ${book.title}`}
        width={width}
        height={height}
        className="h-auto w-full rounded-lg border border-[var(--border-subtle)] object-contain shadow-sm"
        loading="lazy"
      />
      {inShelf && (
        <div className="absolute right-1 top-1 rounded-full bg-white p-1 shadow">
          <Check className="h-5 w-5 text-[var(--color-success)]" />
        </div>
      )}
    </div>
  );
}
