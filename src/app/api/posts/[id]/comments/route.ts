// File: src/app/api/posts/[postId]/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getViewer, publicUserSelect } from '@lib/api';
import { prisma } from '@lib/prisma';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const viewer = await getViewer();
  const { id } = await params;

  if (!viewer) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const { content } = await req.json();

  const comment = await prisma.comment.create({
    data: {
      authorUsername: viewer.username,
      postId: id,
      content,
    },
    include: {
      author: { select: publicUserSelect },
    },
  });

  return NextResponse.json(comment, { status: 201 });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { searchParams } = new URL(req.url);
  const limit  = Number(searchParams.get('limit')  ?? 20);
  const cursor = searchParams.get('cursor');
  const { id } = await params;

  const comments = await prisma.comment.findMany({
    where: { postId: id },
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
    ...(cursor
      ? { skip: 1, cursor: { id: cursor } }
      : {}),
    include: { author: { select: publicUserSelect } },
  });

  const nextCursor = comments.length > limit ? comments.pop()!.id : undefined;
  return NextResponse.json({ comments, cursor: nextCursor });
}
