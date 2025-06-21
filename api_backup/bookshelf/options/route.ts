// File: src/app/api/bookshelf/options/route.ts
import { NextResponse } from 'next/server';
import { getViewer } from '@lib/api';
import { db } from '@/src/lib/db';

export async function GET() {
  const viewer = await getViewer();
  if (!viewer) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const entries = await db.userBook.findMany({
    where: { userUsername: viewer.username },
    include: { book: true },
  });

  const options = entries.map((e) => ({
    book: e.book,
    progress: e.progress,
    status: e.status,
    progressPct: e.book.pages
      ? Math.min(100, Math.round((e.progress / e.book.pages) * 100))
      : null,
  }));

  return NextResponse.json(options);
}
