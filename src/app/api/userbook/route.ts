// File: src/app/api/userbook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getViewerSession } from '@services/viewer.service';
import { UserBookService } from '@services/server/userBook.service';

export async function GET() {
  const session = await getViewerSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const books = await UserBookService.getAllForUser(session.username);
  return NextResponse.json(books);
}

export async function POST(req: NextRequest) {
  const session = await getViewerSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const created = await UserBookService.create(session.username, body);
  return NextResponse.json(created);
}