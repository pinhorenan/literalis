// src/clients/notificationClient.ts
import { NotificationDTO, NotificationMarkReadDTO } from '@models/notification.model';
const NOTIF_BASE = '/api/notifications';

/**
 * Lista as notificações do usuário autenticado.
 * GET /api/notifications?take=&cursor=
 */
export async function listNotifications(take = 20, cursor?: string): Promise<NotificationDTO[]> {
  const params = new URLSearchParams({ take: String(take) });
  if (cursor) params.set('cursor', cursor);

  const res = await fetch(`${NOTIF_BASE}?${params.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Erro ao listar notificações');
  }
  return res.json();
}

/**
 * Retorna a contagem de notificações não lidas.
 * GET /api/notifications/unread-count
 */
export async function countUnread(): Promise<number> {
  const res = await fetch(`${NOTIF_BASE}/unread-count`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Erro ao obter contagem de não lidas');
  }
  const { count } = await res.json();
  return count;
}

/**
 * Marca uma notificação como lida.
 * PATCH /api/notifications/:id/read
 */
export async function markAsRead(id: string): Promise<void> {
  const res = await fetch(`${NOTIF_BASE}/${encodeURIComponent(id)}/read`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id } as NotificationMarkReadDTO),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Erro ao marcar notificação como lida');
  }
}
