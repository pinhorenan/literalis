// src/app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getViewerSession } from '@services/viewer.service';
import { PostService } from '@services/server/post.service';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const viewerSession = await getViewerSession();
    const viewerUsername = viewerSession ? viewerSession.username : null;

    const post = await PostService.getById(id, viewerUsername);
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const updatedPost = await PostService.update(id, body);

    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 400 });
  }
}\

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const deletedPost = await PostService.delete(id);

    return NextResponse.json(deletedPost);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 400 });
  }
}