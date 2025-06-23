import type { Notification, User } from '@prisma/client';
import type { NotificationDTO } from '@models/notification.dto';
import { mapUserToMinimalDTO } from '@mappers/user.mapper';

/**
 * Map a Prisma Notification record and its actor to NotificationDTO
 * @param notification - Prisma Notification record
 * @param actor        - Prisma User record who triggered the notification
 */
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
