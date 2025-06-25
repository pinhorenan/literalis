// src/app/api/books/route.ts
import { BookService } from '@services/book.service';
import { NextResponse } from 'next/server';

const bookService = new BookService();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query')?.trim();
    if (!query) {
      return NextResponse.json({ error: 'Parâmetro “query” é obrigatório' }, { status: 400 });
    }
    const take = Number(searchParams.get('take') ?? 10);
    const books = await bookService.searchBooks(query, take);
    return NextResponse.json(books);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
