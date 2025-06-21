// File: src/app/api/upload/cover/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import { getViewer } from '@lib/api';
import { prisma } from '@lib/prisma';
import { join } from 'path';

const coverDir = join(process.cwd(), 'public', 'uploads', 'covers');

export async function POST(req: NextRequest) {
  await getViewer(); 
  const form = await req.formData();
  const isbn = form.get('isbn')?.toString();
  const file = form.get('file') as File;

  if (!isbn) {
    return NextResponse.json({ error: 'ISBN obrigatório' }, { status: 400 });
  }
  if (!file || file.type.split('/')[0] !== 'image') {
    return NextResponse.json({ error: 'Arquivo inválido' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${isbn}-${Date.now()}.jpg`;
  await writeFile(join(coverDir, filename), buffer);

  const url = `/uploads/covers/${filename}`;
  await prisma.book.update({
    where: { isbn },
    data: { coverUrl: url },
  });

  return NextResponse.json({ url });
}

export async function DELETE(req: NextRequest) {
  await getViewer();
  const { searchParams } = new URL(req.url);
  const isbn = searchParams.get('isbn');

  if (!isbn) {
    return NextResponse.json({ error: 'ISBN obrigatório' }, { status: 400 });
  }

  const book = await prisma.book.findUnique({ where: { isbn } });
  if (!book?.coverUrl) {
    return NextResponse.json({ ok: true });
  }

  const filepath = join(process.cwd(), 'public', book.coverUrl);
  await unlink(filepath).catch(() => null);

  await prisma.book.update({
    where: { isbn },
    data: { coverUrl: '/images/covers/default.jpg' },
  });

  return NextResponse.json({ ok: true });
}
