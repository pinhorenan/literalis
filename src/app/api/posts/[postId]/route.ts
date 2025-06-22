// src/app/api/posts/[postId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getViewerSession } from '@/src/services/viewer.service';
import { PostService } from '@services/server/post.service';

export async function DELETE(_: NextRequest, { params }: { params: { postId: string } }) {
    const viewer = await getViewerSession();
    if (!viewer || !viewer.user?.username) {
        return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    try {
        await PostService.deletePost(params.postId, viewer.user.username);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao remover post.' }, { status: 400 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { postId: string } }) {
  const viewer = await getViewerSession();
  if (!viewer || !viewer.user?.username) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const data = await req.json();
  try {
    const post = await PostService.updatePost(params.postId, viewer.user.username, data);
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao editar post' }, { status: 400 });
  }
}
