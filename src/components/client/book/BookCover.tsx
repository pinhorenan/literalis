// File: src/components/client/book/BookCovert.tsx
'use client';

import Image from 'next/image';
import { Check } from 'lucide-react';
import type { BookDTO } from '@dto/book.dto';

interface Props {
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
}: Props) {
    return (
        <div className={`relative ${className}`}>
            <Image
                src={book.coverUrl || '/images/book-placeholder.png'}
                alt={book.title}
                width={width}
                height={height}
                className="w-full h-auto rounded-lg border border-[var(--border-subtle)] shadow-sm"
            />
            {inShelf && (
                <div className="absolute top-1 right-1 p-1 bg-white rounded-full shadow">
                    <Check className="w-5 h-5 text-[var(--color-success)]" />
                </div>
            )}
        </div>
    );        
}