// src/models/user.dto.ts

export type UserBaseDTO = {
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
  followerCount: number;
  followingCount: number;
  followingUsernames: string[];
  followerUsernames: string[];
  postCount: number;
  bookCount: number;
};

export type UserDTO = UserBaseDTO & {
  isMe: boolean;
  isFollower: boolean;
  isFollowing: boolean;
};

export type PublicUserDTO = {
    username: string;
    name: string;
    avatarUrl: string;
    bio?: string;
};

export type CreateUserDTO = {
    username: string;
    name: string;
    email: string;
    avatarUrl?: string;
    bio?: string;
};

export interface UpdateUserDTO {
    name?: string;
    email?: string;
    avatarUrl?: string;
    bio?: string;
};