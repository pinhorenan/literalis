// src/app/api/bookshelf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getShelfByUser, upsertShelfItem } from '@/src/services/bookshelf.service';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'Faltando userId' }, { status: 400 });
  }
  const items = await getShelfByUser(userId);
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const item = await upsertShelfItem(body);
  return NextResponse.json(item, { status: 201 });
}
