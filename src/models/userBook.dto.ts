// File: src/models/userBook.dto.ts
import type { BookDTO } from '@models/book.dto';
import type { UserDTO } from '@models/user.dto';

export type ShelfStatus = 'READING' | 'TO_READ' | 'READ' | 'ABANDONED';

export type UserBookDTO = {
    user: UserDTO;
    book: BookDTO;
    currentPage: number;

    rating: number;
    addedAt: string;
    updatedAt: string;

    status: ShelfStatus;
    isPrivate: boolean;
}