// src/repository/userBook.repository.ts
import { db } from '@lib/db';
import { bookshelfInclude, bookshelfOptionSelect } from '@/src/includes/bookshelf.include';
import type { CreateBookshelfEntryDTO, BookshelfUpdateDTO } from '@/src/models/bookshelf.dto';

export const BookshelfRepository = {
  // Busca todos os livros ativos de um usuário (sem removedAt)
  findAllByUser: (userUsername: string) => {
    return db.userBook.findMany({
      where: {
        userUsername,
        removedAt: null,
      },
      include: bookshelfInclude,
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
      include: bookshelfInclude,
    });
  },

  // Lista simplificada para selects/autocomplete
  findOptionsByUser: (userUsername: string) => {
    return db.userBook.findMany({
      where: {
        userUsername,
        removedAt: null,
      },
      select: bookshelfOptionSelect,
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
      include: bookshelfInclude,
    });
  },



  // Cria nova entrada na estante do usuário com include
  create: (userUsername: string, bookIsbn: string, data?: Partial<CreateBookshelfEntryDTO>) => {
    return db.userBook.create({
      data: {
        userUsername,
        bookIsbn,
        ...data,
      },
      include: bookshelfInclude,
    });
  },

  // Atualiza uma entrada específica na estante com include
  update: (userUsername: string, bookIsbn: string, data: Partial<BookshelfUpdateDTO>) => {
    return db.userBook.update({
      where: {
        userUsername_bookIsbn: {
          userUsername,
          bookIsbn,
        },
      },
      data,
      include: bookshelfInclude,
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
      include: bookshelfInclude,
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
      include: bookshelfInclude,
    });
  },
};
