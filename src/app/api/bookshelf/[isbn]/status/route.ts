// File: src/app/api/bookshelf/[isbn]/status/route.ts
import { NextResponse } from 'next/server';
import { getViewer } from '@lib/api';
import { prisma } from '@lib/prisma';

export async function GET(_: Request, { params }: { params: Promise<{ isbn: string }> }) {
  const viewer = await getViewer();
  const { isbn } = await params;
  if (!viewer) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const exists = await prisma.userBook.count({
    where: {
      userUsername: viewer.username,
      bookIsbn: isbn,
    },
  });

  return NextResponse.json({ added: exists > 0 });
}
