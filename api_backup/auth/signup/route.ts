// File: src/app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { publicUserSelect } from '@lib/api';
import { db } from '@/src/lib/db';
import bcrypt from 'bcryptjs';

import type { SignUpDTO } from '@models/auth.dto';

export async function POST(req: NextRequest) {
  const {
    username,
    email,
    password,
    name,
    avatarUrl,
    bio,
  } = (await req.json()) as SignUpDTO;

  if (!username || !email || !password || !name) {
    return NextResponse.json(
      { error: 'Dados obrigatórios faltando' },
      { status: 400 },
    );
  }

  const exists = await db.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });

  if (exists) {
    return NextResponse.json(
      { error: 'Usuário ou e‑mail já cadastrado' },
      { status: 409 },
    );
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await db.user.create({
    data: {
      username,
      email,
      name,
      avatarUrl: avatarUrl ?? undefined,
      bio: bio ?? undefined,
      password: hash,
    },
    select: publicUserSelect,
  });

  return NextResponse.json(user, { status: 201 });
}
