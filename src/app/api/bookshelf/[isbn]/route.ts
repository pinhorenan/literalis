// src/app/api/bookshelf/[isbn]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getShelfItem, upsertShelfItem, removeShelfItem } from '@/src/services/bookshelf.service';

export async function GET(req: NextRequest, { params }: { params: Promise<{ isbn: string }> }) {
  const { isbn } = await params;
  const { searchParams } = new URL(req.url);

  const userId = searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'Faltando userId' }, { status: 400 });
  }

  const item = await getShelfItem(userId, isbn);
  if (!item) {
    return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 });
  }
  return NextResponse.json(item);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ isbn: string }> }) {
  const { isbn } = await params;
  const { searchParams } = new URL(req.url);

  const userId = searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'Faltando userId' }, { status: 400 });
  }

  await removeShelfItem(userId, isbn);
  return NextResponse.json({ message: 'Removido' }, { status: 200 });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ isbn: string }> }) {
  const { isbn } = await params;
  const body = await req.json();
  // body deve conter userId, bookIsbn, status, currentPage, isPrivate, rating

  const item = await upsertShelfItem({ ...body, bookIsbn: isbn });
  return NextResponse.json(item, { status: 201 });
}
