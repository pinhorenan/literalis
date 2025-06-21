// File: src/components/server/book/BookCover.tsx
import Image from 'next/image';
import { Check } from 'lucide-react';
import type { BookDTO } from '@dto/book.dto';

interface BookCoverProps {
  book: BookDTO;
  inShelf?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

export default function BookCover({
  book,
  inShelf = false,
  width = 120,
  height = 180,
  className = '',
}: BookCoverProps) {
  return (
    <div className={`relative ${className}`}>
      <Image
        src={book.coverUrl}
        alt={`Capa: ${book.title}`}
        width={width}
        height={height}
        className="rounded object-contain border"
      />
      {inShelf && (
        <div className="absolute top-1 right-1 p-1 bg-white rounded-full shadow">
          <Check className="w-5 h-5 text-[var(--color-success)]" />
        </div>
      )}
    </div>
  );
}
