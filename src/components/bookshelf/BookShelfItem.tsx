// File: src/components/bookshelf/BookShelfItem.tsx
'use client';

import { useRef }       from 'react';
import OptionsMenu      from '@components/ui/OptionsMenu';
import BookCover        from '@components/book/BookCover';
import BookInfo         from '@components/book/BookInfo';
import type { Book }    from '@prisma/client';


export interface ShelfItemType {
    book: Book;
    progress: number;
    addedAt: string;
}

interface ShelfItemProps {
    item: ShelfItemType;
    viewMode: 'grid' | 'list';
    isOwner: boolean;
    onEdit: (isbn: string, oldProgress: number) => void;
    onDelete: (isbn: string) => void;
    className?: string;
}

export default function ShelfItem({
    item,
    viewMode,
    isOwner,
    onEdit,
    onDelete,
    className = '',
}: ShelfItemProps) {
    const { book, progress } = item;
    const menuRef = useRef<HTMLDivElement>(null);

    if (viewMode === 'grid') {
        return (
            <div className={`relative group w-full max-w-[180px] mx-auto ${className}`}>
                <BookCover 
                    src={book.coverUrl} 
                    alt={book.title}
                    width={180} 
                    className="w-full h-auto rounded-xl border border-[var(--border-subtle)] shadow-sm transition-transform duration-200 transform group-hover:scale-105" 
                />

                <div className="absolute bottom-2 left-2 right-2 text-center">
                    <div className="w-full h-2 rounded bg-black/30 border border-white/20 overflow-hidden">
                        <div
                            className="h-full bg-[var(--color-primary)] transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
                
                {isOwner && (
                    <div
                        ref={menuRef} 
                        className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <OptionsMenu
                            onEdit={() => onEdit(book.isbn, progress)}
                            onDelete={() => onDelete(book.isbn)}
                        />
                    </div>
                )}
            </div>
        );
    }

    // Modo lista   
    return (
        <div className={`relative flex items-center px-4 py-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] shadow-sm transition hover:bg-[var(--surface-card-hover)] ${className}`}>
            <BookCover
                src={book.coverUrl}
                alt={book.title}
                width={180}
                className="rounded-md border border-[var(--border-base)] shadow-sm"
            />

            <div className="ml-4 flex-1">
                <BookInfo 
                    book={book}  
                    className="text-sm"
                    showPublicationDate
                    strongIsbnLabel={false}
                />
                
                <div className="mt-2">
                    <div className="w-full h-2 bg-[var(--color-secondary)] border border-[var(--border-base)] rounded overflow-hidden">
                        <div
                            className="h-full bg-[var(--color-primary)] transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="text-xs text-right text-[var(--text-secondary)] mt-1">
                        {progress}% lido
                    </div>
                </div>
            </div>

            {isOwner && (
                <div ref={menuRef} className="absolute top-2 right-2 z-10">
                    <OptionsMenu
                        onEdit={() => onEdit(book.isbn, progress)}
                        onDelete={() => onDelete(book.isbn)}
                    />
                </div>
            )}
        </div>
    );
}