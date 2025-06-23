// File: src/app/api/bookshelf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getViewerSession } from '@services/viewer.service';
import { BookshelfService } from '@services/server/bookshelf.service';

export async function GET() {
  const session = await getViewerSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const books = await BookshelfService.getAllForUser(session.username);
  return NextResponse.json(books);
}

export async function POST(req: NextRequest) {
  const session = await getViewerSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const created = await BookshelfService.create(session.username, body);
  return NextResponse.json(created);
}