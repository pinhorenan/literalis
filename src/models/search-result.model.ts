// src/models/search-result.model.ts
import { BookDTO } from './book.model';
import { UserDTO } from './user.model';

export interface SearchResultDTO {
  users: UserDTO[];
  books: BookDTO[];
}
