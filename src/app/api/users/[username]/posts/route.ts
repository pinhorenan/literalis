// src/app/api/users/[username]/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { listUserPosts } from '@/services/post.service';
import { getUserByUsername } from '@/services/user.service';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get('cursor') ?? undefined;
  const take = Number(searchParams.get('take') ?? 20);

  const user = await getUserByUsername(username);
  if (!user) return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404 });

  const session = await auth();
  const viewerId = session?.user?.id;

  const page = await listUserPosts(user.id, viewerId, take, cursor);
  return NextResponse.json(page);
}
