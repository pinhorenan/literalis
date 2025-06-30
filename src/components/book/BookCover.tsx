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
  width = 900,
  height = 1500,
  className = '',
}: Props) {
  return (
    <div className={`relative ${className}`}>
      <Image
        src={book.coverUrl || '/images/book-placeholder.png'}
        alt={`Capa do livro ${book.title}`}
        width={width}
        height={height}
        className="h-fit w-fit rounded-lg border border-[var(--border-subtle)] object-contain shadow-sm"
        loading="lazy"
      />
    </div>
  );
}
