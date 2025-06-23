// src/app/api/books/[isbn]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { BookService } from '@services/server/book.service';

export async function GET(_: NextRequest, { params }: { params: { isbn: string } }) {
  const book = await BookService.getByIsbn(params.isbn);
  if (!book) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }
  return NextResponse.json(book);
}

export async function PATCH(req: NextRequest, { params }: { params: { isbn: string } }) {
  const data = await req.json();

  try {
    const updated = await BookService.update(params.isbn, data);
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { isbn: string } }) {
  try {
    const deleted = await BookService.delete(params.isbn);
    return NextResponse.json(deleted);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
