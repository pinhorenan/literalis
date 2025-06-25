// src/services/post.service.ts
import { Post, Prisma } from '@prisma/client';

import { bookRepository } from '@repositories/book.repository';
import { bookshelfRepository } from '@repositories/bookshelf.repository';
import { commentRepository } from '@repositories/comment.repository';
import { followRepository } from '@repositories/follow.repository';
import { postRepository } from '@repositories/post.repository';
import { userRepository } from '@repositories/user.repository';

import { LikeService } from '@services/like.service';
import { NotificationService } from '@services/notification.service';

import { CommentDTO, mapCommentToDTO } from '@models/comment.model';
import { mapPostToDTO, PostDTO } from '@models/post.model';

export class PostService {
  private likeService = new LikeService();
  private notificationService = new NotificationService();

  /**
   * POST /api/posts
   * Cria um post vinculado a uma entrada da estante (POST-001)
   */
  async createPost(params: {
    authorUsername: string;
    bookIsbn: string;
    content: string;
    currentPage: number;
    rating?: number;
  }): Promise<PostDTO> {
    const { authorUsername, bookIsbn, content, currentPage, rating } = params;

    const entry = await bookshelfRepository.findByOwnerAndBook(authorUsername, bookIsbn);
    if (!entry) throw new Error('Entrada de estante não encontrada');

    const book = await bookRepository.findByIsbn(bookIsbn);
    if (!book) throw new Error('Livro não encontrado');

    if (currentPage > book.pages) throw new Error('Página atual excede total de páginas');

    const progress = Math.floor((currentPage / book.pages) * 100);

    const data: Prisma.PostCreateInput = {
      author: { connect: { username: authorUsername } },
      book: { connect: { isbn: bookIsbn } },
      content,
      currentPage,
      totalPages: book.pages,
      progress,
      rating,
    };

    const post = await postRepository.create(data);

    await bookshelfRepository.update(authorUsername, bookIsbn, {
      currentPage,
      rating,
      status: currentPage === book.pages ? 'READ' : 'READING',
    });

    const author = await userRepository.findByUsername(authorUsername);
    if (!author) throw new Error('Autor não encontrado');

    return mapPostToDTO(post, author, book, [], []);
  }

  /**
   * PATCH /api/posts/:postId  (POST-002)
   */
  async editPost(
    postId: string,
    authorUsername: string,
    data: { content?: string; currentPage?: number; rating?: number },
  ): Promise<PostDTO> {
    const post = await postRepository.findById(postId);
    if (!post || post.authorUsername !== authorUsername) throw new Error('Post não encontrado');

    const book = await bookRepository.findByIsbn(post.bookIsbn);
    if (!book) throw new Error('Livro não encontrado');

    if (data.currentPage !== undefined && data.currentPage > book.pages) {
      throw new Error('Página excede total de páginas');
    }

    const progress =
      data.currentPage !== undefined
        ? Math.floor((data.currentPage / book.pages) * 100)
        : post.progress;

    const updated = await postRepository.update(postId, {
      content: data.content,
      currentPage: data.currentPage,
      rating: data.rating,
      progress,
    });

    const author = await userRepository.findByUsername(authorUsername);
    if (!author) throw new Error('Autor não encontrado');

    return mapPostToDTO(updated, author, book, [], []);
  }

  /**
   * DELETE /api/posts/:postId
   */
  async deletePost(postId: string, authorUsername: string): Promise<void> {
    const post = await postRepository.findById(postId);
    if (!post || post.authorUsername !== authorUsername) throw new Error('Post não encontrado');
    await postRepository.delete(postId);
  }

  // ---------- FEEDS -------------------------------------------------------

  private async buildPostDTO(post: Post, currentUser?: string): Promise<PostDTO> {
    const author = await userRepository.findByUsername(post.authorUsername);
    if (!author) throw new Error('Autor não encontrado');
    const book = await bookRepository.findByIsbn(post.bookIsbn);
    if (!book) throw new Error('Livro não encontrado');

    const rawComments = await commentRepository.findByPost(post.id, 3);
    const comments: CommentDTO[] = await Promise.all(
      rawComments.map(async (c): Promise<CommentDTO> => {
        const commentAuthor = await userRepository.findByUsername(c.authorUsername);
        if (!commentAuthor) throw new Error('Autor do comentário não encontrado');
        return mapCommentToDTO(c, commentAuthor, []);
      }),
    );

    const likesUsers = await this.likeService.listPostLikes(post.id, 20);

    return mapPostToDTO(post, author, book, likesUsers, comments);
  }

  /**
   * GET /api/posts/feed/friends  (POST-003)
   */
  async feedFriends(username: string, take = 20, cursor?: string): Promise<PostDTO[]> {
    const following = await followRepository.findFollowing(username);
    const authors = following.map((f) => f.followedUsername);
    if (authors.length === 0) return [];

    const prismaCursor = cursor ? { id: cursor } : undefined;
    const feed = await postRepository.findByAuthors(authors, take, prismaCursor);

    return Promise.all(feed.map((p) => this.buildPostDTO(p, username)));
  }

  /**
   * GET /api/posts/feed/discover  (POST-003)
   */
  async feedDiscover(username: string, take = 20, cursor?: string): Promise<PostDTO[]> {
    const following = await followRepository.findFollowing(username);
    const ignored = new Set(following.map((f) => f.followedUsername).concat([username]));

    const prismaCursor = cursor ? { id: cursor } : undefined;
    const feed = await postRepository.findExcludingAuthors(Array.from(ignored), take, prismaCursor);

    return Promise.all(feed.map((p) => this.buildPostDTO(p, username)));
  }
}
