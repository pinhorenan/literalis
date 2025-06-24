import { BookDTO } from '../core/book.model';
import { UserDTO } from '../core/user.model';

export interface SearchResultDTO {
  users: UserDTO[];
  books: BookDTO[];
}
