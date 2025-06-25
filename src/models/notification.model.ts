// src/models/notification.model.ts
import { Notification, NotificationType, User } from '@prisma/client';
import z from 'zod';
import { mapUserToMinimalDTO, MinimalUserDTO } from './user.model';

export interface NotificationDTO {
  id: string;
  notifType: NotificationType;
  createdAt: Date;
  readAt?: Date;
  actor: MinimalUserDTO;
  postId?: string;
  commentId?: string;
}

export const notificationMarkReadSchema = z.object({
  id: z.string(),
});
export type NotificationMarkReadDTO = z.infer<typeof notificationMarkReadSchema>;

export function mapNotificationToDTO(notification: Notification, actor: User): NotificationDTO {
  return {
    id: notification.id,
    notifType: notification.notifType,
    createdAt: notification.createdAt,
    readAt: notification.readAt ?? undefined,
    actor: mapUserToMinimalDTO(actor),
    postId: notification.postId ?? undefined,
    commentId: notification.commentId ?? undefined,
  };
}
