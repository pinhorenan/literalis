// src/repositories/postLike.repository.ts
import { db } from '@libs/db';
import { PostLike, Prisma } from '@prisma/client';

export const postLikeRepository = {
  async create(data: Prisma.PostLikeCreateInput): Promise<PostLike> {
    return db.postLike.create({ data });
  },

  async delete(userUsername: string, postId: string): Promise<PostLike> {
    return db.postLike.delete({
      where: {
        userUsername_postId: { userUsername, postId },
      },
    });
  },

  async exists(userUsername: string, postId: string): Promise<boolean> {
    const count = await db.postLike.count({
      where: { userUsername, postId },
    });
    return count > 0;
  },

  async findByPost(postId: string, take = 20): Promise<PostLike[]> {
    return db.postLike.findMany({
      where: { postId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take,
    });
  },

  async findByUser(userUsername: string, take = 20): Promise<PostLike[]> {
    return db.postLike.findMany({
      where: { userUsername },
      include: { post: true },
      orderBy: { createdAt: 'desc' },
      take,
    });
  },
};
