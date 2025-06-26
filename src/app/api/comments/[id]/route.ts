// src/app/api/comments/[id]/route.ts
import { CommentService } from '@services/comment.service';
import { NextResponse } from 'next/server';

const commentService = new CommentService();

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    // TODO: proteger rota e extrair username da sessão
    const author = req.headers.get('x-username');
    if (!author) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const { content } = await req.json();
    const updated = await commentService.editComment(params.id, author, content);
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // TODO: proteger rota e extrair username da sessão
    const user = req.headers.get('x-username');
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    await commentService.deleteComment(params.id, user);
    return NextResponse.json(null, { status: 204 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
