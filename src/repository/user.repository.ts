// src/repository/user.repository.ts
import { db } from '@lib/db';
import { publicUserSelect, userWithCountsSelect } from '@includes/user.include';
import type { CreateUserDTO, UpdateUserDTO } from '@models/user.dto';

export const UserRepository = {
    findByUsername: (username: string) => {
        return db.user.findUnique({
            where: { username },
            select: userWithCountsSelect,
        });
    },

    findPublicByUsername: (username: string) => {
        return db.user.findUnique({
            where: { username },
            select: publicUserSelect,
        });
    },

    findRawWithFollows: (username: string) => {
      return db.user.findUnique({
        where: { username },
        include: {
          followers: true,
          following: true,
        },
      });
    },

    search: (query: string, limit = 10) => {
        return db.user.findMany({
            where: {
                OR: [
                    { username: { contains: query, mode: 'insensitive' } },
                    { name: { contains: query, mode: 'insensitive' } },
                ],
            },
            take: limit,
            select: publicUserSelect,
        });
    },

    listAllPublic: () => {
      return db.user.findMany({
        select: publicUserSelect,
        orderBy: { createdAt: 'desc' },
      });
    },

    
    isFollowedBy: (targetUsername: string, viewerUsername: string) => {
        return db.follow.findUnique({
            where: {
                followerUsername_followedUsername: {
                    followedUsername: targetUsername,
                    followerUsername: viewerUsername,
                },
            },
        });
    },

    create: (data: CreateUserDTO) => {
        return db.user.create({ data });
    },

    update: (username: string, data: UpdateUserDTO) => {
        return db.user.update({
            where: { username },
            data,
        });
    },

    delete: (username: string) => {
        return db.user.delete({
            where: { username },
        });
    },
};
