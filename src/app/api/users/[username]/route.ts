// src/app/api/users/[username]/route.ts
import { userUpdateSchema } from '@models/user.model';
import { UserService } from '@services/user.service';
import { NextResponse } from 'next/server';

const userService = new UserService();

export async function GET(req: Request, { params }: { params: { username: string } }) {
  try {
    const user = await userService.getByUsername(params.username);
    if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    const { passwordHash, ...safe } = user;
    return NextResponse.json(safe);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { username: string } }) {
  try {
    // TODO: proteger rota e garantir que session.user.username === params.username
    const authUser = req.headers.get('x-username');
    if (authUser !== params.username) {
      return NextResponse.json({ error: 'Proibido' }, { status: 403 });
    }

    const body = await req.json();
    const data = userUpdateSchema.parse(body);
    const updated = await userService.update(params.username, data);
    const { passwordHash, ...safe } = updated;
    return NextResponse.json(safe);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
