// src/app/api/notifications/unread-count/route.ts
import { NotificationService } from '@services/notification.service';
import { NextResponse } from 'next/server';

const notifService = new NotificationService();

export async function GET(req: Request) {
  try {
    // TODO: proteger rota e extrair username da sessão
    const recipient = req.headers.get('x-username');
    if (!recipient) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const count = await notifService.countUnread(recipient);
    return NextResponse.json({ count });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
