// app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPostById } from '@/services/post.service';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const viewerId = session?.user?.id;

  const post = await getPostById(id, viewerId);
  if (!post) return NextResponse.json({ message: 'Post not found' }, { status: 404 });
  return NextResponse.json(post);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  await prisma.post.deleteMany({
    where: { id, authorId: session.user.id },
  });
  return new NextResponse(null, { status: 204 });
}
