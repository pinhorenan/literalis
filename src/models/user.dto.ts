// src/models/user.dto.ts

export interface UserDTO {
  username: string;
  name: string;
  email: string;
  avatarUrl: string;
  bio: string;
  createdAt: Date;
  updatedAt: Date;
  postCount: number;
  bookCount: number;
  followerCount: number;
  followingCount: number;
  followerUsernames: string[];
  followingUsernames: string[];
};

export interface PublicUserDTO {
  username: string;
  name: string;
  bio: string;
  avatarUrl: string;
  postCount: number;
  bookCount: number;
  followerCount: number;
  followingCount: number;
  followerUsernames: string[];
  followingUsernames: string[];
};

export interface PrivateUserDTO extends PublicUserDTO {
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface UserWithContextDTO extends PublicUserDTO {
  isMe: boolean;
  isFollowing: boolean;
  isFollower: boolean;
};

export interface MinimalUserDTO {
  username: string;
  name: string;
  avatarUrl: string;
};

export interface CreateUserDTO {
  username: string;
  email: string;
  name: string;
};

export interface UpdateUserDTO {
  name: string;
  bio: string;
  email: string;
  avatarUrl: string;
};
