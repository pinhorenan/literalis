import { getViewerSession } from '@services/viewer.service';

import { BookRepository } from '@repositories/book.repository';
import { PostRepository } from '@repositories/post.repository';
import { NotificationService } from '@services/notification.service';

import {
  mapPostToDTO,
  postCreateSchema,
  postUpdateSchema,
  type PostCreateDTO,
  type PostDTO,
  type PostUpdateDTO,
} from '@models/post.model';

export class PostService {
  /** Feed global / filtrado */
  static async listFeed(viewerUsername: string | null, limit = 20) {
    const posts = await PostRepository.listFeed(
      viewerUsername,
      {}, // nenhum filtro extra por enquanto
      limit,
    );
    return posts;
  }

  /** Busca completo por ID */
  static async get(id: string): Promise<PostDTO> {
    const full = await PostRepository.findFull(id);
    if (!full) throw new Error('Post não encontrado');

    return mapPostToDTO(
      full,
      full.author,
      full.book,
      full.likes.map((l) => l.user),
      full.comments.map(CommentService.mapRecordToDTO),
    );
  }

  /** Cria um post (POST-001) */
  static async create(dto: PostCreateDTO): Promise<PostDTO> {
    const viewer = await getViewerSession(true);
    const data = postCreateSchema.parse(dto);

    // garantir livro existente
    const book = await BookRepository.find(data.bookIsbn);
    if (!book) throw new Error('Livro não encontrado');

    // progress / pages
    const totalPages = book.pages;
    const progress = Math.floor((data.currentPage / totalPages) * 100);

    const created = await PostRepository.create({
      content: data.content,
      bookIsbn: data.bookIsbn,
      authorUsername: viewer!.username,
      currentPage: data.currentPage,
      totalPages,
      progress,
      rating: data.rating,
    });

    // notificação: nenhum requisito
    return this.get(created.id);
  }

  /** Atualiza conteúdo, página ou rating (POST-002) */
  static async update(id: string, dto: PostUpdateDTO): Promise<PostDTO> {
    const viewer = await getViewerSession(true);
    const post = await PostRepository.findFull(id);
    if (!post) throw new Error('Post não encontrado');
    if (post.author.username !== viewer!.username) throw new Error('Proibido');

    const data = postUpdateSchema.parse(dto);

    // se mudar currentPage, recalcular progress
    let newProgress = post.progress;
    if (data.currentPage !== undefined) {
      newProgress = Math.floor((data.currentPage / post.totalPages) * 100);
      data.progress = newProgress;
    }

    await PostRepository.update(id, data as any);
    return this.get(id);
  }

  static async remove(id: string) {
    const viewer = await getViewerSession(true);
    const post = await PostRepository.findFull(id);
    if (!post || post.author.username !== viewer!.username) throw new Error('Proibido');
    await PostRepository.delete(id);
    return { removed: true };
  }

  static async toggleLike(id: string) {
    const viewer = await getViewerSession(true);
    const liked = await PostRepository.toggleLike(viewer!.username, id);
    if (liked) {
      await NotificationService.create({
        recipientUsername: (await PostRepository.findFull(id))!.author.username,
        actorUsername: viewer!.username,
        notifType: 'LIKE',
        postId: id,
      });
    }
    return { liked };
  }
}
