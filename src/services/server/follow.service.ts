// src/services/server/follow.service.ts
import { db } from '@lib/db';

export const FollowService = {
    async isFollowing(followerUsername: string, followedUsername: string): Promise<boolean> {
        const existing = await db.follow.findUnique({
            where: { followerUsername_followedUsername: { followerUsername, followedUsername } }
        });
        return !!existing;
    },

    async follow(followerUsername: string, followedUsername: string): Promise<void> {
        if (followerUsername === followedUsername) return;

        await db.follow.upsert({
            where: { followerUsername_followedUsername: { followerUsername, followedUsername } },
            update: {},
            create: { followerUsername, followedUsername },
        });
    },

    async unfollow(followerUsername: string, followedUsername: string): Promise<void> {
        if (followerUsername === followedUsername) return;

        await db.follow.deleteMany({
          where: { followerUsername, followedUsername },  
        });
    },

    async toggle(followerUsername: string, followedUsername: string): Promise<{ followed: boolean }> {
        const already = await FollowService.isFollowing(followerUsername, followedUsername);
        if (already) {
            await FollowService.unfollow(followerUsername, followedUsername);
            return { followed: false };
        } else {
            await FollowService.follow(followerUsername, followedUsername);
            return { followed: true };
        }
    },

    async getCounts(username: string): Promise<{ followerCount: number; followingCount: number }> {
        const [followerCount, followingCount] = await Promise.all([
            db.follow.count({ where: { followedUsername: username } }),
            db.follow.count({ where: { followerUsername: username } }),
        ]);
        return { followerCount, followingCount };
    },
};