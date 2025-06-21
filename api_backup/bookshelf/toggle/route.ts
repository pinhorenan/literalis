// File: src/app/api/bookshelf/toggle/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getViewer } from '@lib/api';
import { db } from '@/src/lib/db';

export async function POST(req: NextRequest) {
  const viewer = await getViewer();
  if (!viewer) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const { isbn } = await req.json();

  const composite = {
    userUsername_bookIsbn: {
      userUsername: viewer.username,
      bookIsbn: isbn,
    },
  };

  const existing = await db.userBook.findUnique({ where: composite });

  if (existing) {
    await db.userBook.delete({ where: composite });
    return NextResponse.json({ added: false });
  }

  await db.userBook.create({ data: { userUsername: viewer.username, bookIsbn: isbn } });
  return NextResponse.json({ added: true });
}
