// src/app/api/bookshelf/[bookIsbn]/route.ts
import { ReadingStatus } from '@prisma/client';
import { BookshelfService } from '@services/bookshelf.service';
import { NextResponse } from 'next/server';

const shelfService = new BookshelfService();

export async function PATCH(req: Request, { params }: { params: { bookIsbn: string } }) {
  try {
    // TODO: proteger rota e extrair username da sessão
    const owner = req.headers.get('x-username');
    if (!owner) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const data = (await req.json()) as {
      currentPage?: number;
      status?: ReadingStatus;
      rating?: number;
      isPrivate?: boolean;
    };
    const updated = await shelfService.updateEntry(owner, params.bookIsbn, data);
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { bookIsbn: string } }) {
  try {
    // TODO: proteger rota e extrair username da sessão
    const owner = req.headers.get('x-username');
    if (!owner) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    await shelfService.removeEntry(owner, params.bookIsbn);
    return NextResponse.json(null, { status: 204 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
