// src/app/api/posts/route.ts
import { postCreateSchema } from '@models/post.model';
import { PostService } from '@services/post.service';
import { NextResponse } from 'next/server';

const postService = new PostService();

export async function POST(req: Request) {
  try {
    // TODO: proteger rota e extrair username da sessão
    const author = req.headers.get('x-username');
    if (!author) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const data = postCreateSchema.parse(await req.json());
    const post = await postService.createPost({ authorUsername: author, ...data });
    return NextResponse.json(post, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
