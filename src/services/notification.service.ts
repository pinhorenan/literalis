// src/services/notification.service.ts
import { NotificationType } from '@prisma/client';

import { mapNotificationToDTO, NotificationDTO } from '@models/notification.model';
import { notificationRepository } from '@repositories/notification.repository';
import { userRepository } from '@repositories/user.repository';

export class NotificationService {
  /**
   * NOT-001 — seguir alguém
   */
  async notifyFollow(follower: string, followed: string): Promise<void> {
    if (follower === followed) return;
    await notificationRepository.create({
      actor: { connect: { username: follower } },
      recipient: { connect: { username: followed } },
      notifType: NotificationType.FOLLOW,
    });
  }

  /**
   * NOT-001 — curtir post
   */
  async notifyPostLike(actor: string, postAuthor: string, postId: string): Promise<void> {
    if (actor === postAuthor) return;
    await notificationRepository.create({
      actor: { connect: { username: actor } },
      recipient: { connect: { username: postAuthor } },
      post: { connect: { id: postId } },
      notifType: NotificationType.LIKE,
    });
  }

  /**
   * NOT-001 — comentar post
   */
  async notifyComment(postAuthor: string, commenter: string, postId: string): Promise<void> {
    if (commenter === postAuthor) return;
    await notificationRepository.create({
      actor: { connect: { username: commenter } },
      recipient: { connect: { username: postAuthor } },
      post: { connect: { id: postId } },
      notifType: NotificationType.COMMENT,
    });
  }

  /**
   * GET /api/notifications
   */
  async listNotifications(
    recipientUsername: string,
    take = 20,
    cursor?: string,
  ): Promise<NotificationDTO[]> {
    const raws = await notificationRepository.findByRecipient(recipientUsername, take, cursor);

    return Promise.all(
      raws.map(async (n) => {
        const actor = await userRepository.findByUsername(n.actorUsername);
        if (!actor) throw new Error('Actor não encontrado');
        return mapNotificationToDTO(n, actor);
      }),
    );
  }

  /**
   * PATCH /api/notifications/:id/read
   */
  async markAsRead(id: string): Promise<void> {
    await notificationRepository.markAsRead(id);
  }

  /**
   * GET /api/notifications/unread-count
   */
  async countUnread(recipientUsername: string): Promise<number> {
    return notificationRepository.countUnread(recipientUsername);
  }
}
