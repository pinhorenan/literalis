// src/models/follow.dto.ts
import type { PublicUserDTO } from './user.dto';

export interface FollowDTO {
  user: PublicUserDTO;
  createdAt: string;
};

export interface FullFollowDTO {
  follower: PublicUserDTO;
  followed: PublicUserDTO;
  createdAt: string;
};
