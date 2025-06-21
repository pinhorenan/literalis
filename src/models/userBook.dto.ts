// File: src/dto/userBook.dto.ts
import type { BookDTO } from '@models/book.dto';
import type { UserDTO } from '@models/user.dto';

export type ShelfStatus = 'READING' | 'TO_READ' | 'READ' | 'ABANDONED';

// TODO: Adicionar 'notes', 'tags', e 'rating'
// ? 'rating' poderá ser de 0 a 10 (representado por estrelas de 0 a 5, onde cada estrela representa 2 pontos). Pode contribuir para a média de avaliações do livro.
export type UserBookDTO = {
    user: UserDTO;
    book: BookDTO;
    progressPages: number;
    progressPct: number | null;

    addedAt: string;
    updatedAt: string;

    status: ShelfStatus;
    isPrivate: boolean;
}