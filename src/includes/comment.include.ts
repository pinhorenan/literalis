import { publicUserSelect } from '@includes/user.include';

export const commentInclude = {
  author: { select: publicUserSelect },
  likes:  { select: { user: { select: publicUserSelect } } },
} as const;
