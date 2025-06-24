import { mapNotificationToDTO, notificationMarkReadSchema } from '@models/notification.model';
import { NotificationRepository } from '@repositories/notification.repository';
import { getViewerSession } from '@services/viewer.service';

export class NotificationService {
  /** Criação interna (FOLLOW, LIKE, COMMENT) */
  static async create(data: {
    recipientUsername: string;
    actorUsername: string;
    notifType: 'FOLLOW' | 'LIKE' | 'COMMENT';
    postId?: string;
    commentId?: string;
  }) {
    if (data.recipientUsername === data.actorUsername) return; // não notifica a si mesmo
    await NotificationRepository.create(data);
  }

  /** Feed de notificações do usuário */
  static async list(limit = 20) {
    const viewer = await getViewerSession(true);
    const rows = await NotificationRepository.listForUser(viewer!.username, limit);
    return rows.map((n: any) => mapNotificationToDTO(n, n.actor));
  }

  /** Marca uma notificação como lida */
  static async markRead(id: string) {
    const viewer = await getViewerSession(true);
    const data = notificationMarkReadSchema.parse({ id });
    const n = await NotificationRepository.markRead(data.id);
    if (n.recipientUsername !== viewer!.username) throw new Error('Proibido');
    return { read: true };
  }
}
