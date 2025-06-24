import { publicUserSelect } from '@lib/api/user.include';

export const notificationInclude = {
  actor: { select: publicUserSelect },
} as const;
