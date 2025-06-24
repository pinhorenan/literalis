import { minimalBookSelect } from '@includes/book.include';
import { feedPostInclude } from '@includes/post.include';
import { publicUserSelect } from '@includes/user.include';
import { db } from '@libs/db';
import type { Prisma } from '@prisma/client';

export const PostRepository = {
  async listFeed(
    viewer: string | null,
    where: Prisma.PostWhereInput,
    limit = 20,
    cursor?: { id: string; createdAt: Date },
  ) {
    return db.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      ...(cursor ? { skip: 1, cursor } : {}),
      include: feedPostInclude(viewer),
    });
  },

  listByAuthor(authorUsername: string, viewer: string | null, limit = 10) {
    return db.post.findMany({
      where: { authorUsername },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: feedPostInclude(viewer),
    });
  },

  findFull(id: string) {
    return db.post.findUnique({
      where: { id },
      include: {
        author: { select: publicUserSelect },
        book: { select: minimalBookSelect },
        likes: { select: { user: { select: publicUserSelect } } },
        comments: {
          orderBy: { createdAt: 'asc' },
          include: {
            author: { select: publicUserSelect },
            likes: { select: { user: { select: publicUserSelect } } },
          },
        },
      },
    });
  },

  create(data: Prisma.PostUncheckedCreateInput) {
    return db.post.create({ data });
  },

  update(id: string, data: Prisma.PostUpdateInput) {
    return db.post.update({ where: { id }, data });
  },

  delete(id: string) {
    return db.post.delete({ where: { id } });
  },

  async toggleLike(user: string, postId: string) {
    const existing = await db.postLike.findUnique({
      where: { userUsername_postId: { userUsername: user, postId } },
    });
    if (existing) {
      await db.postLike.delete({
        where: {
          userUsername_postId: {
            userUsername: existing.userUsername,
            postId: existing.postId,
          },
        },
      });
      return false;
    }
    await db.postLike.create({ data: { userUsername: user, postId } });
    return true;
  },
};
