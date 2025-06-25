// src/app/api/books/[isbn]/route.ts
import { BookService } from '@services/book.service';
import { NextResponse } from 'next/server';

const bookService = new BookService();

export async function GET(req: Request, { params }: { params: { isbn: string } }) {
  try {
    const { isbn } = params;
    const book = await bookService.getBookByIsbn(isbn);
    if (!book) return NextResponse.json({ error: 'Livro não encontrado' }, { status: 404 });
    return NextResponse.json(book);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
