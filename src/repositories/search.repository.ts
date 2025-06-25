// src/repositories/search.repository.ts
import { db } from '@libs/db';
import { Book, User } from '@prisma/client';

export const searchRepository = {
  async searchUsers(query: string, take = 20): Promise<User[]> {
    return db.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { name: { contains: query, mode: 'insensitive' } },
        ],
      },
      take,
      orderBy: { username: 'asc' },
    });
  },

  async searchBooks(query: string, take = 20): Promise<Book[]> {
    return db.book.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { author: { contains: query, mode: 'insensitive' } },
        ],
      },
      take,
      orderBy: { title: 'asc' },
    });
  },

  async search(
    query: string,
    userLimit = 20,
    bookLimit = 20,
  ): Promise<{ users: User[]; books: Book[] }> {
    const [users, books] = await Promise.all([
      this.searchUsers(query, userLimit),
      this.searchBooks(query, bookLimit),
    ]);
    return { users, books };
  },
};
