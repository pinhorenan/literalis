// src/repositories/npotification.repository.ts
import { db } from '@libs/db';
import { Notification, Prisma } from '@prisma/client';

export const notificationRepository = {
  async create(data: Prisma.NotificationCreateInput): Promise<Notification> {
    return db.notification.create({ data });
  },

  async findById(id: string): Promise<Notification | null> {
    return db.notification.findUnique({ where: { id } });
  },

  async findByRecipient(
    recipientUsername: string,
    take = 20,
    cursor?: string,
  ): Promise<Notification[]> {
    return db.notification.findMany({
      where: { recipientUsername },
      orderBy: { createdAt: 'desc' },
      take,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    });
  },

  async countUnread(recipientUsername: string): Promise<number> {
    return db.notification.count({
      where: { recipientUsername, readAt: null },
    });
  },

  async markAsRead(id: string): Promise<Notification> {
    return db.notification.update({
      where: { id },
      data: { readAt: new Date() },
    });
  },
};
