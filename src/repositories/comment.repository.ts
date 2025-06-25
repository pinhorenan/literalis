// src/repositories/comment.repository.ts
import { db } from '@libs/db';
import { Comment, Prisma } from '@prisma/client';

export const commentRepository = {
  async create(data: Prisma.CommentCreateInput): Promise<Comment> {
    return db.comment.create({ data });
  },

  async findById(id: string): Promise<Comment | null> {
    return db.comment.findUnique({ where: { id } });
  },

  async fiindByPost(postId: string, take = 20, cursor?: string): Promise<Comment[]> {
    return db.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'desc' },
      take,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    });
  },

  async update(id: string, data: Prisma.CommentUpdateInput): Promise<Comment> {
    return db.comment.update({
      where: { id },
      data,
    });
  },

  async delete(id: string): Promise<Comment> {
    return db.comment.delete({ where: { id } });
  },
};
