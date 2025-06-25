// src/repositories/bookshelf.repository.ts
import { db } from '@libs/db';
import { BookshelfEntry, Prisma } from '@prisma/client';

export const bookshelfRepository = {
  async addEntry(data: Prisma.BookshelfEntryCreateInput): Promise<BookshelfEntry> {
    return db.bookshelfEntry.create({ data });
  },

  async findByOwnerAndBook(
    ownerUsername: string,
    bookIsbn: string,
  ): Promise<BookshelfEntry | null> {
    return db.bookshelfEntry.findUnique({
      where: {
        ownerUsername_bookIsbn: { ownerUsername, bookIsbn },
      },
    });
  },

  async findPublicByOwner(ownerUsername: string): Promise<BookshelfEntry[]> {
    return db.bookshelfEntry.findMany({
      where: { ownerUsername, isPrivate: false, removedAt: null },
      orderBy: { addedAt: 'desc' },
    });
  },

  async findAllByOwner(ownerUsername: string): Promise<BookshelfEntry[]> {
    return db.bookshelfEntry.findMany({
      where: { ownerUsername, removedAt: null },
      orderBy: { addedAt: 'desc' },
    });
  },

  async update(
    ownerUsername: string,
    bookIsbn: string,
    data: Prisma.BookshelfEntryUpdateInput,
  ): Promise<BookshelfEntry> {
    return db.bookshelfEntry.update({
      where: {
        ownerUsername_bookIsbn: { ownerUsername, bookIsbn },
      },
      data,
    });
  },

  async softDelete(ownerUsername: string, bookIsbn: string): Promise<BookshelfEntry> {
    return db.bookshelfEntry.update({
      where: {
        ownerUsername_bookIsbn: { ownerUsername, bookIsbn },
      },
      data: { removedAt: new Date() },
    });
  },
};
