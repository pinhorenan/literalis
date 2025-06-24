import type { Prisma } from '@prisma/client';
import { db } from '@libs/db';
import { commentInclude } from '@includes/comment.include';

export const CommentRepository = {
  listByPost(postId: string, limit = 30, cursor?: { id: string; createdAt: Date }) {
    return db.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
      take: limit,
      ...(cursor ? { skip: 1, cursor } : {}),
      include: commentInclude,
    });
  },

  find(id: string) {
    return db.comment.findUnique({ where: { id }, include: commentInclude });
  },

  create(data: Prisma.CommentUncheckedCreateInput) {
    return db.comment.create({ data, include: commentInclude });
  },

  update(id: string, data: Prisma.CommentUpdateInput) {
    return db.comment.update({ where: { id }, data, include: commentInclude });
  },

  delete(id: string) {
    return db.comment.delete({ where: { id } });
  },

  async toggleLike(user: string, commentId: string) {
    const existing = await db.commentLike.findUnique({
      where: { userUsername_commentId: { userUsername: user, commentId } },
    });
    if (existing) {
      await db.commentLike.delete({
        where: {
          userUsername_commentId: {
            userUsername: existing.userUsername,
            commentId: existing.commentId,
          },
        },
      });
      return false;
    }
    await db.commentLike.create({ data: { userUsername: user, commentId } });
    return true;
  },
};
