// src/includes/follow.include.ts
import { publicUserSelect } from './user.include';

export const followInclude = {
  follower: { select: publicUserSelect },
  followed: { select: publicUserSelect },
} as const;
