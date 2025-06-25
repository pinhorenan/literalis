// src/repositories/bookshelf.repository.ts
import { db } from '@libs/db';
import { Post, Prisma } from '@prisma/client';

export const postRepository = {
  async create(data: Prisma.PostCreateInput): Promise<Post> {
    return db.post.create({ data });
  },

  async findById(id: string): Promise<Post | null> {
    return db.post.findUnique({ where: { id } });
  },

  async findByAuthor(authorUsername: string, take = 20, cursor?: string): Promise<Post[]> {
    return db.post.findMany({
      where: { authorUsername },
      orderBy: { createdAt: 'desc' },
      take,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    });
  },

  async findByAuthors(authors: string[], take = 20, cursor?: { id: string }): Promise<Post[]> {
    return db.post.findMany({
      where: { authorUsername: { in: authors } },
      orderBy: { createdAt: 'desc' },
      take,
      ...(cursor ? { cursor, skip: 1 } : {}),
    });
  },

  async findExcludingAuthors(
    excludeAuthors: string[],
    take = 20,
    cursor?: { id: string },
  ): Promise<Post[]> {
    return db.post.findMany({
      where: { authorUsername: { notIn: excludeAuthors } },
      orderBy: { createdAt: 'desc' },
      take,
      ...(cursor ? { cursor, skip: 1 } : {}),
    });
  },

  async findByBook(bookIsbn: string, take = 20, cursor?: string): Promise<Post[]> {
    return db.post.findMany({
      where: { bookIsbn },
      orderBy: { createdAt: 'desc' },
      take,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    });
  },

  async update(id: string, data: Prisma.PostUpdateInput): Promise<Post> {
    return db.post.update({
      where: { id },
      data,
    });
  },

  async delete(id: string): Promise<Post> {
    return db.post.delete({ where: { id } });
  },
};
