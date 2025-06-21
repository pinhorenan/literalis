// File: src/app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { publicUserSelect } from '@lib/api';
import { db } from '@/src/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tab = searchParams.get('tab');
  const q = searchParams.get('q') ?? '';
  const limit = Number(searchParams.get('limit') ?? 20);

  if (tab !== 'users') {
    return NextResponse.json({ error: 'Tab inválida' }, { status: 400 });
  }

  const users = await db.user.findMany({
    where: { username: { contains: q, mode: 'insensitive' } },
    take: limit,
    select: publicUserSelect,
  });

  return NextResponse.json(users);
}
