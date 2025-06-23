// src/services/server/bookshelf.service.ts
import type {
  BookshelfDTO,
  BookshelfCreateDTO,
  BookshelfUpdateDTO,
  BookshelfOptionDTO,
} from '@models/bookshelf.dto';
import { BookshelfRepository } from '@repositories/bookshelf.repository';
import { ShelfStatus } from '@prisma/client';
import { toUserBookDTO } from '@mappers/userBook.mapper';

export const BookshelfService = {
  async getAllForUser(userUsername: string): Promise<BookshelfDTO[]> {
    const entries = await BookshelfRepository.findAllByUser(userUsername);
    return entries.map(entry => toUserBookDTO(entry, null));
  },

  async getPublicForUser(userUsername: string): Promise<BookshelfDTO[]> {
    const entries = await BookshelfRepository.findPublicByUser(userUsername);
    return entries.map(entry => toUserBookDTO(entry, null));
  },

  async getOne(userUsername: string, bookIsbn: string): Promise<BookshelfDTO | null> {
    const entry = await BookshelfRepository.findOne(userUsername, bookIsbn);
    return entry ? toUserBookDTO(entry, null) : null;
  },

  async getOptions(userUsername: string): Promise<BookshelfOptionDTO[]> {
    const options = await BookshelfRepository.findOptionsByUser(userUsername);
    return options.map(opt => ({
      isbn: opt.book.isbn,
      title: opt.book.title,
      coverUrl: opt.book.coverUrl,
      pages: opt.book.pages ?? undefined,
      currentPage: opt.currentPage,
      isPrivate: opt.isPrivate,
    }));
  },
  async create(userUsername: string, data: BookshelfCreateDTO): Promise<BookshelfDTO> {
    const full = await BookshelfRepository.create(userUsername, data.bookIsbn, data);
    return toUserBookDTO(full, null);
  },

  async update(userUsername: string, bookIsbn: string, data: BookshelfUpdateDTO): Promise<BookshelfDTO> {
    const updated = await BookshelfRepository.update(userUsername, bookIsbn, data);
    return toUserBookDTO(updated, null);
  },

  async softDelete(userUsername: string, bookIsbn: string): Promise<BookshelfDTO> {
    const deleted = await BookshelfRepository.softDelete(userUsername, bookIsbn);
    return toUserBookDTO(deleted, null);
  },

  async updateProgress(userUsername: string, bookIsbn: string, currentPage: number): Promise<BookshelfDTO> {
    const updated = await BookshelfRepository.update(userUsername, bookIsbn, { currentPage });
    return toUserBookDTO(updated, null);
  },

  async updateStatus(userUsername: string, bookIsbn: string, status: ShelfStatus): Promise<BookshelfDTO> {
    const updated = await BookshelfRepository.update(userUsername, bookIsbn, { status });
    return toUserBookDTO(updated, null);
  },
};
