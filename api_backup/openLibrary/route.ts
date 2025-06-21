// File: src/app/api/openLibrary/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') ?? '';
  const limit = Number(searchParams.get('limit') ?? 20);

  const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(q)}&limit=${limit}`;
  const res = await fetch(url);
  const data = await res.json();

  const books = (data.docs as any[]).map((d) => ({
    isbn:             d.isbn?.[0] ?? '',
    title:            d.title,
    author:           d.author_name?.[0] ?? '',
    publisher:        d.publisher?.[0] ?? undefined,
    edition:          d.edition ? Number(d.edition[0]) : undefined,
    pages:            d.number_of_pages_median,
    language:         d.language?.[0] ?? undefined,
    publicationDate:  d.first_publish_year
                       ? new Date(d.first_publish_year.toString()).toISOString()
                       : undefined,
    coverUrl:         d.cover_i
                       ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg`
                       : '',
    external:         true,
  }));

  return NextResponse.json(books);
}
