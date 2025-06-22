// src/app/api/bookshelf/[isbn]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getViewerSession } from '@services/viewer.service';
import { BookshelfService } from '@services/server/bookshelf.service';

export async function PATCH(req: NextRequest, { params }: { params: { isbn: string } }) {
  const viewer = await getViewerSession();
  if (!viewer || !viewer.user?.username) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const { currentPage } = await req.json();

  if (typeof currentPage !== 'number' || currentPage < 0) {
    return NextResponse.json({ error: 'Página inválida' }, { status: 400 });
  }

  try {
    await BookshelfService.updateProgress(viewer.user.username, params.isbn, currentPage);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao atualizar progresso' }, { status: 500 });
  }
}
