import { mapBookToDTO, type BookDTO, type MinimalBookDTO } from '@models/book.model';
import { BookRepository } from '@repositories/book.repository';

export class BookService {
  static async get(isbn: string): Promise<BookDTO> {
    const book = await BookRepository.find(isbn);
    if (!book) throw new Error('Livro não encontrado');
    return mapBookToDTO(book as any);
  }

  static async list(): Promise<BookDTO[]> {
    const books = await BookRepository.list();
    return books.map(mapBookToDTO);
  }

  static async search(term: string): Promise<MinimalBookDTO[]> {
    const q = term.trim();
    if (!q) return [];
    return BookRepository.search(q);
  }
}
