// src/app/api/users/[username]/follow/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getViewerSession } from '@services/viewer.service';
import { FollowService } from '@services/server/follow.service';

export async function PATCH(
  _: NextRequest,
  { params }: { params: { username: string } }
) {
  const session = await getViewerSession();
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const result = await FollowService.toggle(
    session.username,
    params.username
  );

  return NextResponse.json(result);
}
