import { CommentService } from '@services/comment.service';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const res = await CommentService.toggleLike(params.id);
    return NextResponse.json(res);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
