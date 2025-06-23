// src/app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PostService } from '@services/server/post.service';
import { getViewerSession } from '@services/viewer.service'; // Supondo que você tenha um serviço para pegar a sessão do usuário
import { BookRepository } from '@repositories/book.repository'; // Certifique-se de ter acesso ao repositório de livros

export async function POST(req: NextRequest) {
  try {
    // 1. Verifique a autenticação do usuário
    const session = await getViewerSession(); // Aqui usamos um serviço que retorna os dados da sessão do usuário, incluindo o username

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userUsername = session.username; // Pegando o username do usuário autenticado
    const body = await req.json(); // Pegando os dados do corpo da requisição
    const { bookIsbn, content, progress } = body;

    if (!bookIsbn || !content || progress === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 2. Buscar o livro completo pelo ISBN
    const book = await BookRepository.findByIsbn(bookIsbn);

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }


    // 4. Chame o serviço para criar o post
    const post = await PostService.create(userUsername, bookIsbn);

    // 5. Retorne a resposta com o post criado
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
