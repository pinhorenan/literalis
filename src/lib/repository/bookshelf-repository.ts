import { db } from '@lib/db';
import { bookshelfEntrySelect } from '@lib/api/bookshelf-entry.include';
import type { Prisma } from '@prisma/client';

export const BookshelfRepository = {
  /** Estante do usuário (publicOnly = false ⇒ inclui privados) */
  listByOwner(username: string, publicOnly = false) {
    return db.bookshelfEntry.findMany({
      where: { ownerUsername: username, ...(publicOnly ? { isPrivate: false } : {}) },
      orderBy: { addedAt: 'desc' },
      select: bookshelfEntrySelect,
    });
  },

  /** Upsert (SHELF-001 / SHELF-002) */
  upsert(owner: string, bookIsbn: string, data: Prisma.BookshelfEntryUpsertArgs['create']) {
    return db.bookshelfEntry.upsert({
      where: { ownerUsername_bookIsbn: { ownerUsername: owner, bookIsbn } },
      create: data,
      update: data,
      select: bookshelfEntrySelect,
    });
  },

  /** Soft-delete (SHELF-004) */
  softDelete(owner: string, bookIsbn: string) {
    return db.bookshelfEntry.update({
      where: { ownerUsername_bookIsbn: { ownerUsername: owner, bookIsbn } },
      data: { removedAt: new Date() },
      select: { removedAt: true },
    });
  },
};
