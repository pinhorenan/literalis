// src/app/api/posts/[id]/comment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { addComment } from '@/services/post.service';
import { auth } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const { content } = await req.json();

    if (!content?.trim()) {
      return NextResponse.json(
        { message: 'Conteúdo do comentário é obrigatório.' },
        { status: 400 },
      );
    }

    const comment = await addComment(id, session.user.id, content.trim());
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar comentário:', error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}
