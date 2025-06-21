// File: src/app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getViewer, fullPostInclude } from '@lib/api';
import { db } from '@prisma/client';
import { db } from '@/src/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const viewer = await getViewer(false);
  const include = fullPostInclude(viewer?.username ?? null) as db.postInclude;
  const { id } = await params;

  const post = await db.post.findUnique({
    where: { id: id },
    include,
  });
  if (!post) {
    return NextResponse.json(
      { error: 'Post não encontrado' },
      { status: 404 }
    );
  }
  return NextResponse.json(post);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const viewer = await getViewer();
  const { id } = await params;
  if (!viewer) {
    return NextResponse.json(
      { error: 'Não autenticado' },
      { status: 401 }
    );
  }

  const data = await req.json();
  const include = fullPostInclude(viewer.username) as db.postInclude;

  const post = await db.post.update({
    where: {
      id: id,
      authorUsername: viewer.username,
    },
    data,
    include,
  });
  return NextResponse.json(post);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const viewer = await getViewer();
  const { id } = await params;
  if (!viewer) {
    return NextResponse.json(
      { error: 'Não autenticado' },
      { status: 401 }
    );
  }

  await db.post.delete({
    where: {
      id: id,
      authorUsername: viewer.username,
    },
  });
  return NextResponse.json({ deleted: true });
}
