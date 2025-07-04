// src/app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  getPostById,
  updatePost,
  deletePost,
  toggleLikePost,
  addComment,
} from '@/src/services/post.service';
import { auth } from '@/lib/auth';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPostById(id);
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await req.json();
  const updated = await updatePost(id, data);
  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  const { id } = await params;
  await deletePost(id);
  return NextResponse.json({ message: 'Post removido.' });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Usuário não autenticado.' }, { status: 401 });
  }

  const viewer = session.user;

  const { id } = await params;
  // rota para curtir ou comentar
  const { action, content } = await req.json();
  if (action === 'like') {
    const result = await toggleLikePost(viewer.id, id);
    return NextResponse.json(result);
  } else if (action === 'comment') {
    const comment = await addComment(viewer.id, id, content);
    return NextResponse.json(comment, { status: 201 });
  }
  return NextResponse.json({ error: 'Ação inválida.' }, { status: 400 });
}
