import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@services/user.service';
import { getViewerSession } from '@services/viewer.service';
import { userUpdateSchema } from '@schemas/user.schema';

export async function GET(_: NextRequest, { params }) {
  const session = await getViewerSession();
  const profile = await UserService.getProfile(session?.username ?? null, params.username);
  if (!profile) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
  return NextResponse.json(profile);
}

export async function PATCH(req: NextRequest, { params }) {
  const session = await getViewerSession();
  if (!session || session.username !== params.username)
    return NextResponse.json({ error: 'Operação negada' }, { status: 403 });

  const body = await req.json();
  const parsed = userUpdateSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });

  const dto = await UserService.update(params.username, parsed.data);
  return NextResponse.json(dto);
}
