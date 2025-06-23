// File: src/models/userBook.dto.ts
import type { BookDTO } from '@models/book.dto';
import type { UserDTO } from '@models/user.dto';

export type ShelfStatus = 'TO_READ' | 'READING' | 'READ' | 'ABANDONED';

export type UserBookDTO = {
    user: UserDTO;
    book: BookDTO;
    currentPage: number;

    addedAt: string;
    updatedAt: string;
    removedAt?: string;
    
    status: ShelfStatus;
    isPrivate: boolean;
    rating?: number;
};

export type UserBookCreateDTO = {
    bookIsbn: string;
    status?: ShelfStatus;
    isPrivate?: boolean;
};

export type UserBookUpdateDTO = {
    currentPage?: number;
    status?: ShelfStatus;
    isPrivate?: boolean;
    rating?: number;
};

export type UserBookOptionDTO = {
    isbn: string;
    title: string;
    coverUrl: string;
    pages?: number;

    currentPage: number;
    isPrivate: boolean;
};