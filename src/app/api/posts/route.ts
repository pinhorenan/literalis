// File: src/app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getViewer, fullPostInclude } from '@lib/api';
import { Prisma } from '@prisma/client';
import { prisma } from '@lib/prisma';

export async function POST(req: NextRequest) {
  const viewer = await getViewer();
  if (!viewer) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const { bookIsbn, content = '', progress = 0 } = await req.json();

  const post = await prisma.post.create({
    data: {
      authorUsername: viewer.username,
      bookIsbn,
      content,
      progress,
    },
    include: fullPostInclude(viewer.username) as Prisma.PostInclude,
  });

  return NextResponse.json(post, { status: 201 });
}

export async function GET(req: NextRequest) {
  const viewer = await getViewer(false);
  const viewerUsername = viewer?.username ?? null;

  const posts = await prisma.post.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' as Prisma.SortOrder },
    include: fullPostInclude(viewerUsername) as Prisma.PostInclude,
  });

  return NextResponse.json({ posts });
}
