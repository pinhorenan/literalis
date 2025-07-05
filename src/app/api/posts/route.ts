// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createPost } from '@/services/post.service';
import { auth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });

  const body = await req.json();
  const post = await createPost({ authorId: session.user.id, ...body });
  return NextResponse.json(post, { status: 201 });
}
