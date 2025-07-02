import type { MinimalUserDTO } from './user.type';

export type NotificationType = 'follow' | 'like' | 'comment' | 'mention' | 'system' | 'custom';

export interface NotificationDTO {
  id: string;
  type: NotificationType;
  actor: MinimalUserDTO;
  message: string;
  link?: string;
  createdAt: Date;
  isRead: boolean;
}
