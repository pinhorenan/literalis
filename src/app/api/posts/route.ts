// src/app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createPost, getFeedPosts } from '@/src/services/post.service';
import { request } from 'http';

export async function GET() {
  const posts = await getFeedPosts();
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const data = await request.json();
  const post = await createPost(data);
  return NextResponse.json(post, { status: 201 });
}
