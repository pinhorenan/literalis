// src/app/api/posts/[id]/like/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getViewerSession } from '@services/viewer.service';
import { PostService } from '@services/server/post.service';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const viewerSession = await getViewerSession();
    if (!viewerSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userUsername = viewerSession.username;

    const liked = await PostService.toggleLike(id, userUsername);
    return NextResponse.json({ liked });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 400 });
  }
}
