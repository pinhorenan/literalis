// src/services/server/userBook.service.ts
import type {
  UserBookDTO,
  UserBookCreateDTO,
  UserBookUpdateDTO,
  UserBookOptionDTO,
} from '@models/userBook.dto';
import { UserBookRepository } from '@repositories/userBook.repository';
import { ShelfStatus } from '@prisma/client';
import { toUserBookDTO } from '@mappers/userBook.mapper';

export const UserBookService = {
  async getAllForUser(userUsername: string): Promise<UserBookDTO[]> {
    const entries = await UserBookRepository.findAllByUser(userUsername);
    return entries.map(entry => toUserBookDTO(entry, null));
  },

  async getPublicForUser(userUsername: string): Promise<UserBookDTO[]> {
    const entries = await UserBookRepository.findPublicByUser(userUsername);
    return entries.map(entry => toUserBookDTO(entry, null));
  },

  async getOne(userUsername: string, bookIsbn: string): Promise<UserBookDTO | null> {
    const entry = await UserBookRepository.findOne(userUsername, bookIsbn);
    return entry ? toUserBookDTO(entry, null) : null;
  },

  async getOptions(userUsername: string): Promise<UserBookOptionDTO[]> {
    const options = await UserBookRepository.findOptionsByUser(userUsername);
    return options.map(opt => ({
      isbn: opt.book.isbn,
      title: opt.book.title,
      coverUrl: opt.book.coverUrl,
      pages: opt.book.pages ?? undefined,
      currentPage: opt.currentPage,
      isPrivate: opt.isPrivate,
    }));
  },

  async create(userUsername: string, data: UserBookCreateDTO): Promise<UserBookDTO> {
    const full = await UserBookRepository.create(userUsername, data.bookIsbn, data);
    return toUserBookDTO(full, null);
  },

  async update(userUsername: string, bookIsbn: string, data: UserBookUpdateDTO): Promise<UserBookDTO> {
    const updated = await UserBookRepository.update(userUsername, bookIsbn, data);
    return toUserBookDTO(updated, null);
  },

  async softDelete(userUsername: string, bookIsbn: string): Promise<UserBookDTO> {
    const deleted = await UserBookRepository.softDelete(userUsername, bookIsbn);
    return toUserBookDTO(deleted, null);
  },

  async delete(userUsername: string, bookIsbn: string): Promise<UserBookDTO> {
    const deleted = await UserBookRepository.delete(userUsername, bookIsbn);
    return toUserBookDTO(deleted, null);
  },

  async updateProgress(userUsername: string, bookIsbn: string, currentPage: number): Promise<UserBookDTO> {
    const updated = await UserBookRepository.update(userUsername, bookIsbn, { currentPage });
    return toUserBookDTO(updated, null);
  },

  async updateStatus(userUsername: string, bookIsbn: string, status: ShelfStatus): Promise<UserBookDTO> {
    const updated = await UserBookRepository.update(userUsername, bookIsbn, { status });
    return toUserBookDTO(updated, null);
  },
};
