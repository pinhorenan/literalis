// src/repositories/commentLike.repository.ts
import { db } from '@libs/db';
import { CommentLike, Prisma } from '@prisma/client';

export const commentLikeRepository = {
  async create(data: Prisma.CommentLikeCreateInput): Promise<CommentLike> {
    return db.commentLike.create({ data });
  },

  async delete(userUsername: string, commentId: string): Promise<CommentLike> {
    return db.commentLike.delete({
      where: {
        userUsername_commentId: { userUsername, commentId },
      },
    });
  },

  async exists(userUsername: string, commentId: string): Promise<boolean> {
    const count = await db.commentLike.count({
      where: { userUsername, commentId },
    });
    return count > 0;
  },

  async findByComment(commentId: string, take = 10): Promise<CommentLike[]> {
    return db.commentLike.findMany({
      where: { commentId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take,
    });
  },

  async findByUser(userUsername: string, take = 10): Promise<CommentLike[]> {
    return db.commentLike.findMany({
      where: { userUsername },
      include: { comment: true },
      orderBy: { createdAt: 'desc' },
      take,
    });
  },
};
