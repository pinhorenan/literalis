// src/app/api/books/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { BookService } from '@services/server/book.service';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');
  const limit = Number(searchParams.get('limit') ?? 10);
  const skip = Number(searchParams.get('skip') ?? 0);
  const orderBy = searchParams.get('orderBy') === 'author' ? 'author' : 'title';

  if (!query) {
    return NextResponse.json({ error: 'Missing query parameter: q' }, { status: 400 });
  }

  const books = await BookService.search(query, limit, skip, orderBy);
  return NextResponse.json(books);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const book = await BookService.create(body);
    return NextResponse.json(book);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
