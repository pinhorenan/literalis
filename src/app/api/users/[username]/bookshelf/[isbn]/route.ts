// src/app/api/users/[username]/bookshelf/[isbn]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getShelfItem, upsertShelfItem, softRemoveShelfItem } from '@/services/bookshelf.service';
import { getUserByUsername } from '@/services/user.service';
import { auth } from '@/lib/auth';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string; isbn: string }> },
) {
  const { username, isbn } = await params;
  const viewer = await auth();
  const target = await getUserByUsername(username);
  if (!target) return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404 });

  const item = await getShelfItem(target.id, isbn, viewer?.user?.id === target.id);
  if (!item) return NextResponse.json({ message: 'Item não encontrado.' }, { status: 404 });

  return NextResponse.json(item);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ username: string; isbn: string }> },
) {
  const { username, isbn } = await params;
  const viewer = await auth();
  if (!viewer?.user?.id) return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });

  const target = await getUserByUsername(username);
  if (!target || target.id !== viewer.user.id)
    return NextResponse.json({ message: 'Proibido.' }, { status: 403 });

  const body = await req.json();
  const item = await upsertShelfItem({ ...body, userId: target.id, bookIsbn: isbn });
  return NextResponse.json(item, { status: 201 });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string; isbn: string }> },
) {
  const { username, isbn } = await params;
  const viewer = await auth();
  if (!viewer?.user?.id) return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });

  const target = await getUserByUsername(username);
  if (!target || target.id !== viewer.user.id)
    return NextResponse.json({ message: 'Proibido.' }, { status: 403 });

  await softRemoveShelfItem(target.id, isbn);
  return new NextResponse(null, { status: 204 });
}
