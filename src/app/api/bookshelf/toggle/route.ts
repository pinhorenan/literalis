// File: src/app/api/bookshelf/toggle/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getViewer } from '@lib/api';
import { prisma } from '@lib/prisma';

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

  const existing = await prisma.userBook.findUnique({ where: composite });

  if (existing) {
    await prisma.userBook.delete({ where: composite });
    return NextResponse.json({ added: false });
  }

  await prisma.userBook.create({ data: { userUsername: viewer.username, bookIsbn: isbn } });
  return NextResponse.json({ added: true });
}
