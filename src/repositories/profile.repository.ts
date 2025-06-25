// src/repositories/profile.repository.ts
import { db } from '@libs/db';
import { User } from '@prisma/client';

export const profileRepository = {
  async findByUsername(username: string): Promise<User | null> {
    return db.user.findUnique({ where: { username } });
  },

  async countPosts(username: string): Promise<number> {
    return db.post.count({ where: { authorUsername: username } });
  },

  async countFollowers(username: string): Promise<number> {
    return db.follow.count({ where: { followedUsername: username } });
  },

  async countFollowing(username: string): Promise<number> {
    return db.follow.count({ where: { followerUsername: username } });
  },

  async countPublicShelfEntries(username: string): Promise<number> {
    return db.bookshelfEntry.count({
      where: { ownerUsername: username, isPrivate: false },
    });
  },
};
