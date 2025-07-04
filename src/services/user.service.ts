// src/services/user.service.ts
import { prisma } from '@/lib/prisma';

export interface ProfileData {
  user: {
    id: string;
    username: string;
    name: string;
    avatarUrl: string;
    bio: string;
  };
  counts: {
    followers: number;
    following: number;
    posts: number;
  };
  isFollowing: boolean;
  isMe: boolean;
}

export interface UserData {
  id: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
  bio: string | null;
  counts: {
    followers: number;
    following: number;
    posts: number;
  };
  isFollowing?: boolean;
  isMe?: boolean;
}

export async function getUserById(userId: string, viewerId?: string): Promise<UserData | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      name: true,
      avatarUrl: true,
      bio: true,
      _count: { select: { followers: true, following: true, posts: true } },
      followers: viewerId
        ? { where: { followerId: viewerId }, select: { followerId: true } }
        : false,
    },
  });

  if (!user || !user.username) return null;

  const data: UserData = {
    id: user.id,
    username: user.username,
    name: user.name,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    counts: {
      followers: user._count.followers,
      following: user._count.following,
      posts: user._count.posts,
    },
  };
  if (viewerId) {
    data.isFollowing = (user.followers?.length ?? 0) > 0;
    data.isMe = user.id === viewerId;
  }
  return data;
}

export async function getUserByUsername(
  username: string,
  viewerId?: string,
): Promise<UserData | null> {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      name: true,
      avatarUrl: true,
      bio: true,
      _count: { select: { followers: true, following: true, bookshelf: true } },
      followers: viewerId
        ? { where: { followerId: viewerId }, select: { followerId: true } }
        : false,
    },
  });

  if (!user || !user.username) return null;

  const data: UserData = {
    id: user.id,
    username: user.username,
    name: user.name,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    counts: {
      followers: user._count.followers,
      following: user._count.following,
      posts: user._count.bookshelf,
    },
  };
  if (viewerId) {
    data.isFollowing = (user.followers?.length ?? 0) > 0;
    data.isMe = user.id === viewerId;
  }
  return data;
}

export async function getUserProfile(
  username: string,
  viewerId?: string,
): Promise<ProfileData | null> {
  const user = await getUserByUsername(username, viewerId);
  if (!user) return null;

  return {
    user: {
      id: user.id,
      username: user.username,
      name: user.name!,
      avatarUrl: user.avatarUrl!,
      bio: user.bio ?? '',
    },
    counts: {
      followers: user.counts.followers,
      following: user.counts.following,
      posts: user.counts.posts,
    },
    isFollowing: user.isFollowing ?? false,
    isMe: user.isMe ?? false,
  };
}

export async function toggleFollow(
  targetUserId: string,
  actorUserId: string,
): Promise<{ isFollowing: boolean; followersCount: number }> {
  const exists = await prisma.follow.findUnique({
    where: { followerId_followedId: { followerId: actorUserId, followedId: targetUserId } },
  });

  if (exists) {
    await prisma.follow.delete({
      where: { followerId_followedId: { followerId: actorUserId, followedId: targetUserId } },
    });
  } else {
    await prisma.follow.create({
      data: {
        followerId: actorUserId,
        followedId: targetUserId,
      },
    });
  }

  const followersCount = await prisma.follow.count({ where: { followedId: targetUserId } });
  return { isFollowing: !exists, followersCount };
}
