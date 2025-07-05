// src/types/user.ts
import type { Paginated } from '@/types/common';

export interface MinimalUser {
  id: string;
  username: string;
  name?: string;
  avatarUrl: string;
}

export interface UserCounters {
  followers: number;
  following: number;
  posts: number;
  books?: number;
}

export interface BooksCount {
  books: number;
}

export interface UserProfile {
  user: MinimalUser & { bio: string };
  counts: UserCounters;
  isFollowing: boolean;
  isMe: boolean;
}


export type FollowersPage = Paginated<MinimalUser>;
export type FollowingPage = Paginated<MinimalUser>;
