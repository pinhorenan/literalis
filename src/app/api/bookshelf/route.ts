// src/app/api/bookshelf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getViewerSession } from '@services/viewer.service';
import { BookshelfService } from '@services/server/bookshelf.service';

export async function GET(_: NextRequest) {
  const viewer = await getViewerSession();
  if (!viewer || !viewer.user?.username) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const books = await BookshelfService.getUserBooks(viewer.user.username);
  return NextResponse.json(books);
}
