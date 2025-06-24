import { NotificationService } from '@services/notification.service';
import { NextResponse } from 'next/server';

export async function GET() {
  const list = await NotificationService.list();
  return NextResponse.json(list);
}
