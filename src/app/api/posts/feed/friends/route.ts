// src/app/api/posts/feed/friends/route.ts
import { PostService } from '@services/post.service';
import { NextResponse } from 'next/server';

const postService = new PostService();

export async function GET(req: Request) {
  try {
    // TODO: proteger rota e extrair username da sessão
    const user = req.headers.get('x-username');
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const url = new URL(req.url);
    const take = Number(url.searchParams.get('take') ?? 20);
    const cursor = url.searchParams.get('cursor') || undefined;

    const feed = await postService.feedFriends(user, take, cursor);
    return NextResponse.json(feed);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
