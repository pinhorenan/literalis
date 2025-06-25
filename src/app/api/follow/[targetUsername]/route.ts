// src/app/api/follow/[targetUsername]/route.ts
import { FollowService } from '@services/follow.service';
import { NextResponse } from 'next/server';

const followService = new FollowService();

export async function POST(req: Request, { params }: { params: { targetUsername: string } }) {
  try {
    // TODO: proteger rota e extrair followerUsername do session
    const followerUsername = req.headers.get('x-username')!;
    if (!followerUsername) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const { targetUsername } = params;
    const result = await followService.toggleFollow(followerUsername, targetUsername);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
