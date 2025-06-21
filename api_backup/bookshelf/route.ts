// File: src/app/api/bookshelf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getViewer } from '@lib/api';
import { db } from '@/src/lib/db';

export async function GET() {
  const viewer = await getViewer();
  if (!viewer) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const shelf = await db.userBook.findMany({
    where: { userUsername: viewer.username },
    include: { book: true },
  });

  return NextResponse.json(shelf);
}

export async function POST(req: NextRequest) {
  const viewer = await getViewer();
  if (!viewer) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const { isbn } = await req.json();

  const record = await db.userBook.upsert({
    where: {
      userUsername_bookIsbn: {
        userUsername: viewer.username,
        bookIsbn: isbn,
      },
    },
    create: {
      userUsername: viewer.username,
      bookIsbn: isbn,
    },
    update: {},
    include: { book: true },
  });

  return NextResponse.json(record, { status: 201 });
}
