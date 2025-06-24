import { NotificationService } from '@services/notification.service';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await NotificationService.markRead(params.id);
    return NextResponse.json({ read: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
