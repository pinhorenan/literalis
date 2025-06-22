// src/models/notification.dto.ts
import type { PublicUserDTO } from '@models/user.dto';

export type NotificationDTO = {
  id: string;
  notifType: 'FOLLOW' | 'LIKE' | 'COMMENT';
  createdAt: string;
  readAt?: string;
  actor: PublicUserDTO;
  recipient: PublicUserDTO;
  postId?: string;
  commentId?: string;
}

export type CreateNotificationDTO = {
  notifType: 'FOLLOW' | 'LIKE' | 'COMMENT';
  actorUsername: string;
  recipientUsername: string;
  postId?: string;
  commentId?: string;
};

export type UpdateNotificationDTO = {
  readAt?: string; // ISO date string
};
