import type { Prisma } from '@prisma/client';
import { db } from '@libs/db';
import { bookshelfEntrySelect } from '@includes/bookshelf-entry.include';

export const BookshelfRepository = {
  listByOwner(username: string, publicOnly = false) {
    return db.bookshelfEntry.findMany({
      where: { ownerUsername: username, ...(publicOnly ? { isPrivate: false } : {}) },
      orderBy: { addedAt: 'desc' },
      select: bookshelfEntrySelect,
    });
  },

  upsert(owner: string, bookIsbn: string, data: Prisma.BookshelfEntryUpsertArgs['create']) {
    return db.bookshelfEntry.upsert({
      where: { ownerUsername_bookIsbn: { ownerUsername: owner, bookIsbn } },
      create: data,
      update: data,
      select: bookshelfEntrySelect,
    });
  },

  softDelete(owner: string, bookIsbn: string) {
    return db.bookshelfEntry.update({
      where: { ownerUsername_bookIsbn: { ownerUsername: owner, bookIsbn } },
      data: { removedAt: new Date() },
      select: { removedAt: true },
    });
  },
};
