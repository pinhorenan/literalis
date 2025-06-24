import { publicUserSelect } from '@includes/user.include';

export const notificationInclude = {
  actor: { select: publicUserSelect },
} as const;
