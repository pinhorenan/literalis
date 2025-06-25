// src/app/api/notifications/[id]/read/route.ts
import { NotificationService } from '@services/notification.service';
import { NextResponse } from 'next/server';

const notifService = new NotificationService();

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    // TODO: proteger rota
    await notifService.markAsRead(params.id);
    return NextResponse.json(null, { status: 204 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
