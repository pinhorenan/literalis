// src/app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getViewerSession } from '@/src/services/viewer.service';
import { PostService } from '@services/server/post.service';

export async function POST(req: NextRequest) {
  const viewer = await getViewerSession();
  if (!viewer || !viewer.user?.username) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const body = await req.json();

  try {
    const post = await PostService.createPost({
      content: body.content,
      progress: body.progress,
      bookIsbn: body.bookIsbn,
      authorUsername: viewer.user.username,
    });
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar post' }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getViewerSession();
  const viewerUsername = session?.user?.username ?? null;

  const url = new URL(req.url);
  const authorUsername = url.searchParams.get('author') ?? undefined;
  const onlyFollowing = url.searchParams.get('following') === 'true';

  const posts = await PostService.getMany({
    viewerUsername,
    authorUsername,
    onlyFollowing,
    take: 20,
  });

  return NextResponse.json(posts);
}
