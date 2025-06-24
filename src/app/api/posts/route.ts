import { PostService } from '@services/post.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const feed = await PostService.listFeed(null);
  return NextResponse.json(feed);
}

export async function POST(req: NextRequest) {
  try {
    const dto = await req.json();
    const post = await PostService.create(dto);
    return NextResponse.json(post, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
