// File: src/app/api/upload/avatar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import { getViewer } from '@lib/api';
import { db } from '@/src/lib/db';
import { join } from 'path';

const avatarDir = join(process.cwd(), 'public', 'uploads', 'avatars');

export async function POST(req: NextRequest) {
  const viewer = await getViewer();
  if (!viewer) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get('file') as File;

  if (!file || file.type.split('/')[0] !== 'image') {
    return NextResponse.json({ error: 'Arquivo inválido' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${viewer.username}-${Date.now()}.jpg`;
  await writeFile(join(avatarDir, filename), buffer);

  const url = `/uploads/avatars/${filename}`;
  await db.user.update({
    where: { username: viewer.username },
    data: { avatarUrl: url },
  });

  return NextResponse.json({ url });
}

export async function DELETE(req: NextRequest) {
  const viewer = await getViewer();
  if (!viewer) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { username: viewer.username },
  });
  if (!user?.avatarUrl) {
    return NextResponse.json({ ok: true });
  }

  const filepath = join(process.cwd(), 'public', user.avatarUrl);
  await unlink(filepath).catch(() => null);

  await db.user.update({
    where: { username: viewer.username },
    data: { avatarUrl: '/images/avatars/default.jpg' },
  });

  return NextResponse.json({ ok: true });
}
