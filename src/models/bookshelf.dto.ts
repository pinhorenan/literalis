// File: src/models/bookshelf.dto.ts
import { BookDTO } from '@models/book.dto';
import { MinimalUserDTO } from '@models/user.dto';

export type ReadingStatus = 'TO_READ' | 'READING' | 'READ' | 'ABANDONED';

export interface BookshelfEntryDTO {
    user: MinimalUserDTO;
    book: BookDTO;
    currentPage: number;
    status: ReadingStatus;
    isPrivate: boolean;
    addedAt: Date;
    updatedAt?: Date;
    removedAt?: Date;
    rating?: number;
};

export interface CreateBookshelfEntryDTO {
    user: MinimalUserDTO;
    book: BookDTO;
    status: ReadingStatus;
    isPrivate: boolean;
};

export interface UpdateBookshelfEntryDTO {
    currentPage: number;
    status: ReadingStatus;
    isPrivate: boolean;
    rating: number;
};
