// File: src/app/api/userbook/[isbn]/progress/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getViewerSession } from '@services/viewer.service';
import { UserBookService } from '@services/server/userBook.service';

export async function PATCH(req: NextRequest, { params }: { params: { isbn: string } }) {
  const session = await getViewerSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { currentPage } = await req.json();
  const updated = await UserBookService.updateProgress(session.username, params.isbn, currentPage);
  return NextResponse.json(updated);
}