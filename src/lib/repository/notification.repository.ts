import { db } from '@lib/db';
import { notificationInclude } from '@lib/api/notification.include';

export const NotificationRepository = {
  /** Lista ordenada desc (NOT-002) */
  listForUser(username: string, limit = 20, cursor?: { id: string; createdAt: Date }) {
    return db.notification.findMany({
      where: { recipientUsername: username },
      orderBy: { createdAt: 'desc' },
      take: limit,
      ...(cursor ? { skip: 1, cursor } : {}),
      include: notificationInclude,
    });
  },

  /** Marcar como lida */
  markRead(id: string) {
    return db.notification.update({ where: { id }, data: { readAt: new Date() } });
  },

  /** Gerar notificação (NOT-001)  */
  create(data: {
    recipientUsername: string;
    actorUsername: string;
    notifType: 'FOLLOW' | 'LIKE' | 'COMMENT';
    postId?: string;
    commentId?: string;
  }) {
    return db.notification.create({ data });
  },
};
