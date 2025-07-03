// src/repos/notification.repository.ts
import { PrismaClient, Prisma } from '@prisma/client';
import BaseRepository from './base.repository';

/**
 * Repositório de notificações, com CRUD genérico herdado de BaseRepository
 * e métodos específicos de domínio.
 */
export class NotificationRepository extends BaseRepository<
  PrismaClient['notification'],
  Prisma.NotificationCreateInput,
  Prisma.NotificationUpdateInput
> {
  /**
   * Construtor público — chama o super() do BaseRepository
   */
  public constructor(prisma: PrismaClient) {
    super(prisma);
  }

  /** Aponta para `client.notification` no PrismaClient */
  protected delegate(client: PrismaClient): PrismaClient['notification'] {
    return client.notification;
  }

  /** Busca notificações não lidas de um destinatário */
  findUnreadByRecipient(recipientId: string, tx?: PrismaClient) {
    return this.delegate(this.client(tx)).findMany({
      where: { recipientId, readAt: null },
      include: { actor: true, post: true, comment: true },
    });
  }

  /** Marca uma notificação como lida */
  markRead(notificationId: string, tx?: PrismaClient) {
    return this.delegate(this.client(tx)).update({
      where: { id: notificationId },
      data: { readAt: new Date() },
    });
  }
}

// Instância singleton exportada
import { prisma } from '@/lib/prisma';
export const notificationRepository = new NotificationRepository(prisma);
export default notificationRepository;
