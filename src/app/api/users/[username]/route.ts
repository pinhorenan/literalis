// File: src/app/api/users/[username]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getViewer, userWithCounts } from '@lib/api';
import { prisma } from '@lib/prisma';

export async function GET(_: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  const viewer = await getViewer(false);
  const { username } = await params;
  const user = await prisma.user.findUnique({
    where: { username: username },
    select: userWithCounts(viewer?.username),
  });
  if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  const viewer = await getViewer();
  const { username } = await params;
  if (viewer?.username !== username) {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
  }
  const data = await req.json();
  const user = await prisma.user.update({
    where: { username: viewer.username },
    data,
    select: userWithCounts(viewer.username),
  });
  return NextResponse.json(user);
}
