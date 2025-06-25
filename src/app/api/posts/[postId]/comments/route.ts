// src/app/api/posts/[postId]/comments/route.ts
import { CommentService } from '@services/comment.service';
import { NextResponse } from 'next/server';

const commentService = new CommentService();

export async function GET(req: Request, { params }: { params: { postId: string } }) {
  try {
    const url = new URL(req.url);
    const take = Number(url.searchParams.get('take') ?? 20);
    const cursor = url.searchParams.get('cursor') || undefined;
    const comments = await commentService.listComments(params.postId, take, cursor);
    return NextResponse.json(comments);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { postId: string } }) {
  try {
    // TODO: proteger rota e extrair username da sessão
    const author = req.headers.get('x-username');
    if (!author) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const { content } = await req.json();
    const comment = await commentService.addComment(params.postId, author, content);
    return NextResponse.json(comment, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
