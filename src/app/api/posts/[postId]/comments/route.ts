// src/app/api/posts/[postId]/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getViewerSession } from '@/src/services/viewer.service';
import { PostService } from '@services/server/post.service';

export async function POST(req: NextRequest, { params }: { params: { postId: string } }) {
  const viewer = await getViewerSession();
  if (!viewer || !viewer.user?.username) {
    return NextResponse.json({ error: 'Usuário não autenticado.' }, { status: 401 });
  }

  const postId = params.postId;
  const { content } = await req.json();

  if (!content || typeof content !== 'string' || !content.trim()) {
    return NextResponse.json({ error: 'Comentário inválido.' }, { status: 400 });
  }

  try {
    const comment = await PostService.createComment(
      postId,
      viewer.user.username,
      content.trim(),
      viewer.user.username // usado para calcular `likedByMe`
    );

    return NextResponse.json(comment);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao adicionar comentário.' }, { status: 500 });
  }
}
