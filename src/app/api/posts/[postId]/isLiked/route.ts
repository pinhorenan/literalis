// src/app/api/posts/[postId]/isLiked/route.ts
import { LikeService } from '@services/like.service';
import { NextResponse } from 'next/server';

const likeService = new LikeService();

export async function GET(req: Request, { params }: { params: { postId: string } }) {
  try {
    // TODO: proteger rota e extrair username da sessão
    const user = req.headers.get('x-username');
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const liked = await likeService.isPostLikedByUser(user, params.postId);
    return NextResponse.json({ liked });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
