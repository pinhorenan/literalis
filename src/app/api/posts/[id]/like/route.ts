// src/app/api/posts/[id]/like/route.ts
import { LikeService } from '@services/like.service';
import { NextResponse } from 'next/server';

const likeService = new LikeService();

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    // TODO: proteger rota e extrair username da sessão
    const user = req.headers.get('x-username');
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    await likeService.likePost(user, params.id);
    return NextResponse.json(null, { status: 204 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // TODO: proteger rota e extrair username da sessão
    const user = req.headers.get('x-username');
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    await likeService.unlikePost(user, params.id);
    return NextResponse.json(null, { status: 204 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
