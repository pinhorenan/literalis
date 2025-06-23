// src/app/api/users/[username]/followers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { FollowService } from '@services/server/follow.service';

export async function GET(
  _: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const followers = await FollowService.getFollowers(params.username);
    return NextResponse.json(followers);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao obter seguidores' }, { status: 500 });
  }
}
