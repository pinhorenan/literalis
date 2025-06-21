// File> src/app/api/posts/[id]/comments/[commentId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getViewer, publicUserSelect } from '@lib/api';
import { db } from '@/src/lib/db';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ commentId: string }> }) {
  const viewer = await getViewer();
  const { commentId } = await params;
  const { content } = await req.json();

  const comment = await db.comment.update({
    where: { id: commentId, authorUsername: viewer?.username },
    data: { content },
    include: { author: { select: publicUserSelect } },
  });

  return NextResponse.json(comment);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ commentId: string }> }) {
  const viewer = await getViewer();
  const { commentId } = await params;
  await db.comment.delete({ where: { id: commentId, authorUsername: viewer?.username } });
  return NextResponse.json({ deleted: true });
}