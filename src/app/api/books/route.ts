// src/app/api/books/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getBooksByName } from '@/services/book.service';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name');

  try {
    if (name) {
      const books = await getBooksByName(name);
      return NextResponse.json(books || [], { status: 200 });
    }

    const books = await prisma.book.findMany({
      select: {
        isbn: true,
        title: true,
        pages: true,
        language: true,
        publisher: { select: { id: true, name: true } },
        authors: { select: { author: { select: { id: true, name: true } } } },
        coverUrl: true,
        genres: { select: { genre: { select: { id: true, name: true } } } },
        publicationDate: true,
        rating: true,
      },
      orderBy: { title: 'asc' },
    });

    const data = books.map((book) => ({
      isbn: book.isbn,
      title: book.title,
      pages: book.pages,
      language: book.language,
      publisher: { id: book.publisher.id, name: book.publisher.name },
      authors: book.authors.map((a) => ({
        id: a.author.id,
        name: a.author.name,
      })),
      coverUrl: book.coverUrl,
      genres: book.genres.map((g) => ({
        id: g.genre.id,
        name: g.genre.name,
      })),
      publicationDate: book.publicationDate.toISOString(), // string JSON-safe
      rating: book.rating,
    }));

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Erro ao buscar livros' }, { status: 500 });
  }
}
