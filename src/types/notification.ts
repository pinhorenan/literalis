// src/types/notification.ts
import type { MinimalUser } from '@/types/user';

export type NotificationType = 'FOLLOW' | 'LIKE' | 'COMMENT' | 'MENTION' | 'REVIEW';

export interface Notification {
  id: string;
  type: NotificationType;
  actor: MinimalUser;
  resourceId?: string;
  createdAt: Date;
  readAt?: Date;
}
