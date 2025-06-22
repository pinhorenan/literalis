// src/models/follow.dto.ts
import type { PublicUserDTO } from './user.dto';

export type FollowDTO = {
  user: PublicUserDTO;
  createdAt: string;
};

export type FullFollowDTO = {
  follower: PublicUserDTO;
  followed: PublicUserDTO;
  createdAt: string;
};
