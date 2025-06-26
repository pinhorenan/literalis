// src/app/api/posts/[postId]/likes/route.ts
import { LikeService } from '@services/like.service';
import { NextResponse } from 'next/server';

const likeService = new LikeService();

export async function GET(req: Request, { params }: { params: { postId: string } }) {
  try {
    const take = Number(new URL(req.url).searchParams.get('take') ?? 10);
    const users = await likeService.listPostLikes(params.postId, take);
    return NextResponse.json(users);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
