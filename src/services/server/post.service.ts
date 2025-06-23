// src/services/server/post.service.ts
import { PostRepository } from '@repositories/post.repository';
import { BookshelfRepository } from '@repositories/bookshelf.repository';
import { FollowService } from '@services/server/follow.service';
import { CommentRepository } from '@repositories/comment.repository';
import type { CreatePostDTO, UpdatePostDTO, PostDTO } from '@models/post.dto';

export const PostService = {
  async toggleLike(postId: string, userUsername: string): Promise<boolean> {
    const existingLike = await PostRepository.isLikedByUser(postId, userUsername);

    if (existingLike) {
      await PostRepository.removeLikeFromPost(postId, userUsername);
      return false;
    } else {
      await PostRepository.addLikeToPost(postId, userUsername);
      return true;
    }
  },

  async addCommentToPost(postId: string, userUsername: string, content: string): Promise<void> {
    await PostRepository.addCommentToPost(postId, userUsername, content);
  },

  async isLikedByUser(postId: string, userUsername: string): Promise<boolean> {
    const like = await PostRepository.isLikedByUser(postId, userUsername);
    return !!like;
  },

  async getById(postId: string, viewerUsername: string | null): Promise<PostDTO> {
    const post = await PostRepository.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    // Contagem de likes e comentários
    const likeCount = await PostRepository.getLikeCount(postId);
    const commentCount = await PostRepository.getCommentCount(postId);
    const likedByMe = await this.isLikedByUser(postId, viewerUsername!);
    const isFollowingAuthor = await FollowService.isFollowing(viewerUsername, post.userUsername);

    // Mapear comentários para o formato esperado no DTO
    const comments = post.comments.map((comment: any) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
      likeCount: comment._count.likes,
      likedByMe: comment.likedBy ? comment.likedBy.some((like: any) => like.username === viewerUsername) : false,
      author: {
        username: comment.author.username,
        name: comment.author.name,
        avatarUrl: comment.author.avatarUrl,
        bio: comment.author.bio,
      },
    }));

    return {
      id: post.id,
      content: post.content,
      progress: post.progress,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      likeCount,
      commentCount,
      likedByMe,
      isFollowingAuthor,
      likedBy: post.likes.map(like => like.userUsername),
      comments,
      userBook: {
        user: {
          ...post.userBook.user,
          createdAt: post.userBook.user.createdAt.toISOString(),
          updatedAt: post.userBook.user.updatedAt.toISOString(),
        },
        book: {
          ...post.userBook.book,
          publicationDate: post.userBook.book.publicationDate?.toISOString() || '', // Convertendo Date para string
        },
        currentPage: post.userBook.currentPage,
        isPrivate: post.userBook.isPrivate,
        addedAt: post.userBook.addedAt.toISOString(),
        updatedAt: post.userBook.updatedAt.toISOString(),
        status: post.userBook.status,
      },
    };
  },

  async getByUser(username: string, viewerUsername: string | null): Promise<PostDTO[]> {
    const posts = await PostRepository.findByUser(username);
    return Promise.all(posts.map(async post => {
      return this.getById(post.id, viewerUsername);
    }));
  },


   async create(userUsername: string, data: CreatePostDTO) {
    // Garantir que a relação entre o usuário e o livro está presente no UserBook
    const userBook = await BookshelfRepository.findOne(userUsername, data.bookshelf.book.isbn);

    if (!userBook) {
      throw new Error('Este livro não está na sua estante');
    }

    // Criação do post associado ao UserBook
    const newPost = await PostRepository.create(userUsername, userBook.book.isbn, {
      bookshelf: data.bookshelf,
      content: data.content,
      progress: data.progress,
    });

    // Recuperando a contagem de likes e comentários
    const likeCount = await PostRepository.getLikeCount(newPost.id);
    const commentCount = await PostRepository.getCommentCount(newPost.id);
    const likedByMe = await this.isLikedByUser(newPost.id, userUsername);

    return {
      ...newPost,
      likeCount,
      commentCount,
      likedByMe,
      isFollowingAuthor: await FollowService.isFollowing(userUsername, newPost.userUsername),
      likedBy: newPost.likes.map(like => like.userUsername),
    };
  },

  async delete(postId: string) {
    return PostRepository.delete(postId);
  },

  async getCommentCount(postId: string): Promise<number> {
    return PostRepository.getCommentCount(postId);
  },
};
