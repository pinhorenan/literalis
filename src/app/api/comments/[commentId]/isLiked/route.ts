// src/app/api/comments/[commentId]/isLiked/route.ts
import { LikeService } from '@services/like.service';
import { NextResponse } from 'next/server';

const likeService = new LikeService();

export async function GET(req: Request, { params }: { params: { commentId: string } }) {
  try {
    // TODO: proteger rota e extrair username da sessão
    const user = req.headers.get('x-username');
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const liked = await likeService.isCommentLikedByUser(user, params.commentId);
    return NextResponse.json({ liked });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
