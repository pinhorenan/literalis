// src/app/api/auth/change-password/route.ts
import { AuthService } from '@services/auth.service';
import { NextResponse } from 'next/server';
import { z } from 'zod';
// import { getServerSession } from 'next-auth/next'
// import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const authService = new AuthService();
const changePwdSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

export async function PATCH(req: Request) {
  try {
    // TODO: proteger rota e extrair username do session
    // const session = await getServerSession(authOptions)
    // if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    // const username = session.user.username

    const username = req.headers.get('x-username')!;
    if (!username) return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 });

    const body = await req.json();
    const { currentPassword, newPassword } = changePwdSchema.parse(body);
    await authService.changePassword(username, currentPassword, newPassword);
    return NextResponse.json(null, { status: 204 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
