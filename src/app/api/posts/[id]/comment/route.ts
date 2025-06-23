// src/app/api/posts/[id]/comment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getViewerSession } from '@services/viewer.service';
import { PostService } from '@services/server/post.service';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { content } = await req.json();
    const viewerSession = await getViewerSession();
    if (!viewerSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userUsername = viewerSession.username;

    await PostService.addCommentToPost(id, userUsername, content);
    return NextResponse.json({ message: 'Comment added successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 400 });
  }
}
