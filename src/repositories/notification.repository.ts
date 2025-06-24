import { db } from '@libs/db';
import { notificationInclude } from '@includes/notification.include';

export const NotificationRepository = {
  listForUser(username: string, limit = 20, cursor?: { id: string; createdAt: Date }) {
    return db.notification.findMany({
      where: { recipientUsername: username },
      orderBy: { createdAt: 'desc' },
      take: limit,
      ...(cursor ? { skip: 1, cursor } : {}),
      include: notificationInclude,
    });
  },

  markRead(id: string) {
    return db.notification.update({ where: { id }, data: { readAt: new Date() } });
  },

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
