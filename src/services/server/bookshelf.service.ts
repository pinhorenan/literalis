// src/server/services/bookshelf.service.ts
import { db } from '@lib/db';

export const BookshelfService = {
  async getUserBooks(username: string) {
    const entries = await db.userBook.findMany({
      where: { userUsername: username },
      include: {
        book: true,
        user: true,
      },
    });

    return entries.map(entry => ({
      user: entry.user,
      book: entry.book,
      currentPage: entry.currentPage,
      rating: entry.rating ?? 0,
      addedAt: entry.addedAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
      status: entry.status,
      isPrivate: entry.isPrivate,
    }));
  },

  async updateProgress(username: string, isbn: string, currentPage: number) {
    return db.userBook.update({
      where: {
        userUsername_bookIsbn: {
          userUsername: username,
          bookIsbn: isbn,
        },
      },
      data: {
        currentPage,
      },
    });
  },
};
