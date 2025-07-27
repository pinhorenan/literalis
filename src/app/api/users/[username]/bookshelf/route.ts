// src/app/api/users/[username]/bookshelf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUserShelf, upsertShelfItem } from '@/services/bookshelf.service';
import { getUserByUsername } from '@/services/user.service';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic'; // Force dynamic rendering for this route

export async function GET(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get('cursor') ?? undefined;
  const take = Number(searchParams.get('take') ?? 20);
  const query = searchParams.get('query') ?? undefined;
  const status = searchParams.get('status') ?? undefined;
  const sortBy = searchParams.get('sortBy') ?? undefined;

  const viewer = await auth();
  const target = await getUserByUsername(username);
  if (!target) return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404 });

  const shelf = await getUserShelf(target.id, take, cursor, viewer?.user?.id === target.id, {
    query,
    status,
    sortBy,
  });
  return NextResponse.json(shelf);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  const viewer = await auth();
  if (!viewer?.user?.id) return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });

  if (viewer.user.username !== username)
    return NextResponse.json({ message: 'Proibido.' }, { status: 403 });

  const body = await req.json();
  const item = await upsertShelfItem({ ...body, userId: viewer.user.id });
  return NextResponse.json(item, { status: 201 });
}
