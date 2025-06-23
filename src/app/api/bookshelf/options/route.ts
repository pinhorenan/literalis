// src/app/api/bookshelf/options/route.ts
import { NextResponse } from 'next/server';
import { getViewerSession } from '@services/viewer.service';
import { BookshelfService } from '@services/server/bookshelf.service';

export async function GET() {
  const session = await getViewerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const options = await BookshelfService.getOptions(session.username);
  return NextResponse.json(options);
}
