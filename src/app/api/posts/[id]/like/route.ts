// File: src/app/api/posts/[postId]/like/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getViewer } from '@lib/api';
import { prisma } from '@lib/prisma';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const viewer = await getViewer();
  const { id } = await params;
  if (!viewer) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const compositeKey = {
    userUsername_postId: {
      userUsername: viewer.username,
      postId: id,
    },
  };

  const existing = await prisma.postLike.findUnique({
    where: compositeKey,
  });

  let likedByMe: boolean;
  if (existing) {
    await prisma.postLike.delete({ where: compositeKey });
    likedByMe = false;
  } else {
    await prisma.postLike.create({
      data: { userUsername: viewer.username, postId: id },
    });
    likedByMe = true;
  }

  const likeCount = await prisma.postLike.count({
    where: { postId: id },
  });

  return NextResponse.json({ likeCount, likedByMe });
}
