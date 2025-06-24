import { NotificationType, Notification, User } from '@prisma/client';
import { type MinimalUserDTO, mapUserToMinimalDTO } from '@models/user.model';
import { z } from 'zod';

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
  id: z.string().min(1),
});
export type NotificationMarkReadDTO = z.infer<typeof notificationMarkReadSchema>;

export function mapNotificationToDTO(
  notification: Notification,
  actor: User
): NotificationDTO {
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
