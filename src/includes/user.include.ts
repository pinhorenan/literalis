// src/includes/user.include.ts
export const publicUserSelect = {
    username: true,
    name: true,
    avatarUrl: true,
    bio: true,
} as const;

export const userWithCountsSelect = {
    ...publicUserSelect,
    createdAt: true,
    updatedAt: true,
    _count: {
        select: {
            posts: true,
            bookshelf: true,
            followers: true,
            following: true,
        },
    },
    followers: {
        select: { followerUsername: true },
        orderBy: { createdAt: 'desc' },
    },
    following: {
        select: { followedUsername: true },
        orderBy: { createdAt: 'desc' },
    },
} as const;