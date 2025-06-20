// File: src/types/users.ts
export interface ClientUser {
    username: string;
    name: string;
    email: string;
    avatarUrl: string;
    bio?: string;
    followerCount: number;
    followingCount: number;
    followerUsernames: string[];
    followingUsernames: string[];
}