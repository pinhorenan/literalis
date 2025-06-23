// src/app/api/bookshelf/[isbn]/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getViewerSession } from '@services/viewer.service';
import { BookshelfService } from '@services/server/bookshelf.service';
import { ShelfStatus } from '@prisma/client';

export async function PATCH(req: NextRequest, { params }: { params: { isbn: string } }) {
  const session = await getViewerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { isbn } = params;
  const { status } = await req.json();

  if (!Object.values(ShelfStatus).includes(status)) {
    return NextResponse.json({ error: 'Status inválido' }, { status: 400 });
  }

  const updated = await BookshelfService.updateStatus(session.username, isbn, status);
  return NextResponse.json(updated);
}
