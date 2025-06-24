import { publicUserSelect } from '@lib/api/user.include';

export const commentInclude = {
  author: { select: publicUserSelect },
  likes:  { select: { user: { select: publicUserSelect } } },
} as const;
