import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@services/user.service';
import { getViewerSession } from '@services/viewer.service';

export async function PATCH(_: NextRequest, { params }) {
  const session = await getViewerSession();
  const viewer = session?.username;
  if (!viewer || viewer === params.username)
    return NextResponse.json({ error: 'Operação inválida' }, { status: 403 });

  const followed = await UserService.toggleFollow(viewer, params.username);
  return NextResponse.json({ followed });
}
