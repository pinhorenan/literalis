// File: src/models/bookshelf.dto.ts
import type { BookDTO } from '@models/book.dto';
import type { UserBaseDTO } from '@models/user.dto';

export type ShelfStatus = 'TO_READ' | 'READING' | 'READ' | 'ABANDONED';

export type BookshelfDTO = {
    user: UserBaseDTO;
    book: BookDTO;
    currentPage: number;

    addedAt: string;
    updatedAt: string;
    removedAt?: string;
    
    status: ShelfStatus;
    isPrivate: boolean;
    rating?: number;
};

export type BookshelfCreateDTO = {
    bookIsbn: string;
    status?: ShelfStatus;
    isPrivate?: boolean;
};

export type BookshelfUpdateDTO = {
    currentPage?: number;
    status?: ShelfStatus;
    isPrivate?: boolean;
    rating?: number;
};

export type BookshelfOptionDTO = {
    isbn: string;
    title: string;
    coverUrl: string;
    pages?: number;

    currentPage: number;
    isPrivate: boolean;
};