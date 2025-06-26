// src/app/api/follow/[username]/route.ts
import { FollowService } from '@services/follow.service';
import { NextResponse } from 'next/server';

const followService = new FollowService();

export async function POST(req: Request, { params }: { params: { username: string } }) {
  try {
    // TODO: proteger rota e extrair followerUsername do session
    const followerUsername = req.headers.get('x-username')!;
    if (!followerUsername) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const { username: targetUsername } = params;
    const result = await followService.toggleFollow(followerUsername, targetUsername);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
