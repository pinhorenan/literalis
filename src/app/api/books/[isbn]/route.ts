import { BookService } from '@services/book.service';
import { NextResponse } from 'next/server';

export async function GET(_req: Request, { params }: { params: { isbn: string } }) {
  try {
    const book = await BookService.get(params.isbn);
    return NextResponse.json(book);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 404 });
  }
}
