// src/app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@lib/db';
import { hash } from 'bcryptjs';
import { z } from 'zod';
import type { SignUpDTO } from '@models/auth.dto';

const signUpSchema: z.ZodType<SignUpDTO> = z.object({
  username:   z.string().min(3),
  name:       z.string().min(1),
  email:      z.string().email(),
  password:   z.string().min(6),
  avatarUrl:  z.string().url().optional().or(z.literal('')), // aceita vazio
  bio:        z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = signUpSchema.parse(body);

    const existing = await db.user.findUnique({
      where: { username: data.username },
    });

    if (existing) {
      return NextResponse.json({ error: 'Usuário já existe.' }, { status: 400 });
    }

    const hashedPassword = await hash(data.password, 10);

    const user = await db.user.create({
      data: {
        ...data,
        avatarUrl: data.avatarUrl?.trim() || '/images/avatars/default.jpg', // default
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        username: user.username,
        name: user.name,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Erro ao criar conta.' },
      { status: 400 }
    );
  }
}
