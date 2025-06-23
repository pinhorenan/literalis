// File: src/app/api/userbook/[isbn]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getViewerSession } from '@services/viewer.service';
import { UserBookService } from '@services/server/userBook.service';

export async function GET(_: NextRequest, { params }: { params: { isbn: string } }) {
  const session = await getViewerSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const book = await UserBookService.getOne(session.username, params.isbn);
  if (!book) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(book);
}

export async function PATCH(req: NextRequest, { params }: { params: { isbn: string } }) {
  const session = await getViewerSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await req.json();
  const updated = await UserBookService.update(session.username, params.isbn, data);
  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: { params: { isbn: string } }) {
  const session = await getViewerSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const deleted = await UserBookService.softDelete(session.username, params.isbn);
  return NextResponse.json(deleted);
}