// src/lib/mappers/user.mapper.ts
import type { User, Follow } from '@prisma/client';
import type { UserDTO } from '../../types/dto/user.dto';

type UserWithFollows = User & {
  followers?: Follow[];
  following?: Follow[];
};

export function toUserDTO(user: UserWithFollows): UserDTO {
  return {
    username: user.username,
    name:     user.name,
    avatarUrl:user.avatarUrl,
    bio:      user.bio ?? undefined,

    followerCount:     user.followers ? user.followers.length : undefined,
    followingCount:    user.following ? user.following.length : undefined,
    followerUsernames: user.followers ? user.followers.map(f => f.followerUsername) : undefined,
    followingUsernames:user.following ? user.following.map(f => f.followedUsername) : undefined,
  };
}
