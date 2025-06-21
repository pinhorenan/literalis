// src/lib/mappers/userBook.mapper.ts
import type { UserBook, User, Book, Follow } from '@prisma/client';
import type { UserBookDTO } from '../../types/dto/userBook.dto';
import { toBookDTO } from './book.mapper';
import { toUserDTO } from './user.mapper';

type UserBookWithRelations = UserBook & {
  user: User & { followers?: Follow[], following?: Follow[] };
  book: Book;
};

export function toUserBookDTO(ub: UserBookWithRelations): UserBookDTO {
  const pages = ub.book.pages ?? null;
  return {
    user:           toUserDTO(ub.user),
    book:           toBookDTO(ub.book),
    progressPages:  ub.progress,
    progressPct:    pages ? Math.round((ub.progress / pages) * 100) : null,
    addedAt:        ub.addedAt.toISOString(),
    updatedAt:      ub.updatedAt.toISOString(),
    status:         ub.status,
    isPrivate:      ub.isPrivate,
  };
}
