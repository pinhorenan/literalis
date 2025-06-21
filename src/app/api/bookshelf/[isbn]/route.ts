// File: src/app/api/bookshelf/[isbn]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getViewer } from '@lib/api';
import { prisma } from '@lib/prisma';

export async function GET(_: NextRequest, { params }: { params: Promise<{ isbn: string }> }) {
  const viewer = await getViewer();
  const { isbn } = await params;
  if (!viewer) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const entry = await prisma.userBook.findUnique({
    where: {
      userUsername_bookIsbn: {
        userUsername: viewer.username,
        bookIsbn: isbn,
      },
    },
    include: { book: true },
  });

  if (!entry) {
    return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
  }

  return NextResponse.json(entry);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ isbn: string }> }) {
  const viewer = await getViewer();
  const { isbn } = await params;
  if (!viewer) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const data = await req.json();
  const updated = await prisma.userBook.update({
    where: {
      userUsername_bookIsbn: {
        userUsername: viewer.username,
        bookIsbn: isbn,
      },
    },
    data,
    include: { book: true },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ isbn: string }> }) {
  const viewer = await getViewer();
  const { isbn } = await params;
  if (!viewer) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  await prisma.userBook.delete({
    where: {
      userUsername_bookIsbn: {
        userUsername: viewer.username,
        bookIsbn: isbn,
      },
    },
  });

  return NextResponse.json({ removed: true });
}
