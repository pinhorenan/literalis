import { NextRequest, NextResponse } from 'next/server';
import { getViewerSession } from '@services/viewer.service';
import { UserService } from '@services/user.service';

export async function GET(_: NextRequest) {
  const session = await getViewerSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const dto = await UserService.getPrivateProfile(session.username);
  return NextResponse.json(dto);
}
