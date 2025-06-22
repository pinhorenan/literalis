// src/app/api/posts/[postId]/like/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getViewerSession } from '@/src/services/viewer.service';
import { PostService } from '@services/server/post.service';

export async function PATCH(_: NextRequest, { params }: { params: { postId: string } }) {
  const viewer = await getViewerSession();
  if (!viewer || !viewer.user.username ) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  const { liked, likeCount } = await PostService.toggleLike(viewer.user.username, params.postId);
  return NextResponse.json({ liked, likeCount });
}
