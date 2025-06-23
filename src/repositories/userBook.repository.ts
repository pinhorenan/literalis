// src/repository/userBook.repository.ts
import { db } from '@lib/db';
import { userBookInclude, userBookOptionSelect } from '@includes/userBook.include';
import type { UserBookCreateDTO, UserBookUpdateDTO } from '@models/userBook.dto';

export const UserBookRepository = {
  // Busca todos os livros ativos de um usuário (sem removedAt)
  findAllByUser: (userUsername: string) => {
    return db.userBook.findMany({
      where: {
        userUsername,
        removedAt: null,
      },
      include: userBookInclude,
    });
  },

  // Busca um único registro de estante pelo usuário e ISBN
  findOne: (userUsername: string, bookIsbn: string) => {
    return db.userBook.findUnique({
      where: {
        userUsername_bookIsbn: {
          userUsername,
          bookIsbn,
        },
      },
      include: userBookInclude,
    });
  },

  // Lista simplificada para selects/autocomplete
  findOptionsByUser: (userUsername: string) => {
    return db.userBook.findMany({
      where: {
        userUsername,
        removedAt: null,
      },
      select: userBookOptionSelect,
    });
  },

  // Busca livros públicos de um usuário (sem removedAt e isPrivate)
  findPublicByUser: (userUsername: string) => {
    return db.userBook.findMany({
      where: {
        userUsername,
        isPrivate: false,
        removedAt: null,
      },
      include: userBookInclude,
    });
  },



  // Cria nova entrada na estante do usuário com include
  create: (userUsername: string, bookIsbn: string, data?: Partial<UserBookCreateDTO>) => {
    return db.userBook.create({
      data: {
        userUsername,
        bookIsbn,
        ...data,
      },
      include: userBookInclude,
    });
  },

  // Atualiza uma entrada específica na estante com include
  update: (userUsername: string, bookIsbn: string, data: Partial<UserBookUpdateDTO>) => {
    return db.userBook.update({
      where: {
        userUsername_bookIsbn: {
          userUsername,
          bookIsbn,
        },
      },
      data,
      include: userBookInclude,
    });
  },

  // Soft delete: define removedAt com now() e retorna com include
  softDelete: (userUsername: string, bookIsbn: string) => {
    return db.userBook.update({
      where: {
        userUsername_bookIsbn: {
          userUsername,
          bookIsbn,
        },
      },
      data: {
        removedAt: new Date(),
      },
      include: userBookInclude,
    });
  },

  // Hard delete com include (casos administrativos)
  delete: (userUsername: string, bookIsbn: string) => {
    return db.userBook.delete({
      where: {
        userUsername_bookIsbn: {
          userUsername,
          bookIsbn,
        },
      },
      include: userBookInclude,
    });
  },
};
