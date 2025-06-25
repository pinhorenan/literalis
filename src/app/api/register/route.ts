// src/app/api/auth/register/route.ts
import { userCreateSchema } from '@models/user.model';
import { AuthService } from '@services/auth.service';
import { NextResponse } from 'next/server';

const authService = new AuthService();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = userCreateSchema.parse(body);
    const user = await authService.register(data);
    // Não expor passwordHash
    const { passwordHash, ...safeUser } = user;
    return NextResponse.json(safeUser, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
