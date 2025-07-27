// src/app/api/posts/[id]/like/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { toggleLike } from '@/services/post.service';
import { auth } from '@/lib/auth';

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const post = await toggleLike(id, session.user.id);
    if (!post) {
      return NextResponse.json({ message: 'Post não encontrado.' }, { status: 404 });
    }

    return NextResponse.json({
      liked: post.likedByMe,
      likesCount: post.likesCount,
    });
  } catch (error) {
    console.error('Erro ao alternar like:', error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}
