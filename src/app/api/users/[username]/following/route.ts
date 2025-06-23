// src/app/api/users/[username]/following/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { FollowService } from '@services/server/follow.service';

export async function GET(
  _: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const following = await FollowService.getFollowing(params.username);
    return NextResponse.json(following);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao obter usuários seguidos' }, { status: 500 });
  }
}
