import { BookshelfService } from '@services/bookshelf.service';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest, { params }: { params: { isbn: string } }) {
  try {
    const dto = await req.json();
    const entry = await BookshelfService.upsert({ ...dto, bookIsbn: params.isbn });
    return NextResponse.json(entry);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { isbn: string } }) {
  try {
    await BookshelfService.remove(params.isbn);
    return NextResponse.json({ removed: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
