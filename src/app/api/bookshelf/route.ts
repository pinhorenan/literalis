import { BookshelfService } from '@services/bookshelf.service';
import { getViewerSession } from '@services/viewer.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const viewer = await getViewerSession(true);
  const list = await BookshelfService.list(viewer!.username, viewer!.username);
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  try {
    const dto = await req.json();
    const entry = await BookshelfService.upsert(dto);
    return NextResponse.json(entry, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
