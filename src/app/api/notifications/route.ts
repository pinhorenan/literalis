// src/app/api/notifications/route.ts
import { NotificationService } from '@services/notification.service';
import { NextResponse } from 'next/server';

const notifService = new NotificationService();

export async function GET(req: Request) {
  try {
    // TODO: proteger rota e extrair username da sessão
    const recipient = req.headers.get('x-username');
    if (!recipient) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const url = new URL(req.url);
    const take = Number(url.searchParams.get('take') ?? 20);
    const cursor = url.searchParams.get('cursor') || undefined;

    const notifs = await notifService.listNotifications(recipient, take, cursor);
    return NextResponse.json(notifs);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
