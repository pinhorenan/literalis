// src/app/api/follow/[username]/followers/route.ts
import { FollowService } from '@services/follow.service';
import { NextResponse } from 'next/server';

const followService = new FollowService();

export async function GET(req: Request, { params }: { params: { username: string } }) {
  try {
    const { username } = params;
    const followers = await followService.listFollowers(username);
    return NextResponse.json(followers);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
