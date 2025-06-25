// src/app/api/bookshelf/route.ts
import { BookshelfService } from '@services/bookshelf.service';
import { NextResponse } from 'next/server';

const shelfService = new BookshelfService();

export async function GET(req: Request) {
  try {
    // TODO: proteger rota e extrair username da sessão
    const owner = req.headers.get('x-username');
    if (!owner) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const url = new URL(req.url);
    const includePrivate = url.searchParams.get('private') === 'true';
    const entries = await shelfService.listEntries(owner, includePrivate);
    return NextResponse.json(entries);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // TODO: proteger rota e extrair username da sessão
    const owner = req.headers.get('x-username');
    if (!owner) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const { bookIsbn } = await req.json();
    const entry = await shelfService.addEntry(owner, bookIsbn);
    return NextResponse.json(entry, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
