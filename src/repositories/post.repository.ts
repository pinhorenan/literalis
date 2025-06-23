// src/repository/post.repository.ts
import { db } from '@lib/db';
import { postInclude } from '@includes/post.include';
import type { CreatePostDTO, UpdatePostDTO } from '@models/post.dto';

export const PostRepository = {
  // Método de adicionar like
  addLikeToPost: (postId: string, userUsername: string) => {
    return db.postLike.create({
      data: {
        postId,
        userUsername,
      },
    });
  },

  // Método de remover like
  removeLikeFromPost: (userUsername: string, postId: string,) => {
    return db.postLike.delete({
      where: {
        userUsername_postId: { userUsername, postId },
      },
    });
  },

  // Método de verificação de like (se o usuário curtiu o post)
  async isLikedByUser(postId: string, userUsername: string): Promise<boolean> {
    const like = await db.postLike.findUnique({
      where: { userUsername_postId: { userUsername, postId } },
    });
    return !!like; // Retorna verdadeiro se o like existe, falso caso contrário
  },
  

  getLikeCount: async (postId: string) => {
    return db.postLike.count({
      where: { postId },
    });
  },

  // Método de adicionar comentário
  addCommentToPost: (postId: string, userUsername: string, content: string) => {
    return db.comment.create({
      data: {
        postId,
        authorUsername: userUsername,
        content,
      },
    });
  },

  // Método de contar comentários
  getCommentCount: (postId: string) => {
    return db.comment.count({
      where: { postId },
    });
  },

  // Encontra um post com as inclusões necessárias
  findById: (id: string) => {
    return db.post.findUnique({
      where: { id },
      include: postInclude,
    });
  },

  // Encontra todos os posts de um usuário
  findByUser: (username: string) => {
    return db.post.findMany({
      where: { userBook: { userUsername: username } },
      include: postInclude,
      orderBy: { createdAt: 'desc' },
    });
  },

  // Cria um post
  create: (userUsername: string, bookIsbn: string, data: CreatePostDTO) => {
    return db.post.create({
      data: { ...data, userUsername, bookIsbn },
      include: postInclude,
    });
  },

  // Atualiza um post
  update: (postId: string, data: Partial<UpdatePostDTO>) => {
    return db.post.update({
      where: { id: postId },
      data,
      include: postInclude,
    });
  },

  // Deleta um post
  delete: (postId: string) => {
    return db.post.delete({
      where: { id: postId },
    });
  },
};
