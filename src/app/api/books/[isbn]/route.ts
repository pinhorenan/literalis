// src/app/api/books/[isbn]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getBookByIsbn } from '@/services/book.service';

export async function GET(req: NextRequest, { params }: { params: Promise<{ isbn: string }> }) {
  const { isbn } = await params;

  try {
    const book = await getBookByIsbn(isbn);
    if (!book) {
      return NextResponse.json({ error: 'Livro não encontrado' }, { status: 404 });
    }
    return NextResponse.json(book);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar livro' }, { status: 500 });
  }
}
