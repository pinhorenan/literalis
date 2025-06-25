// src/app/api/posts/[postId]/route.ts
import { PostService } from '@services/post.service';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const postService = new PostService();
const editSchema = z.object({
  content: z.string().max(1000).optional(),
  currentPage: z.number().int().nonnegative().optional(),
  rating: z.number().min(0).max(10).optional(),
});

export async function PATCH(req: Request, { params }: { params: { postId: string } }) {
  try {
    // TODO: proteger rota e extrair username da sessão
    const author = req.headers.get('x-username');
    if (!author) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const data = editSchema.parse(await req.json());
    const updated = await postService.editPost(params.postId, author, data);
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { postId: string } }) {
  try {
    // TODO: proteger rota e extrair username da sessão
    const author = req.headers.get('x-username');
    if (!author) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    await postService.deletePost(params.postId, author);
    return NextResponse.json(null, { status: 204 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
