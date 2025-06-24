import { BookshelfEntryDTO } from '../core/bookshelf-entry.model';
import { PostDTO } from '../core/post.model';
import { MinimalUserDTO, UserDTO } from '../core/user.model';

export interface PublicProfileDTO {
  user: UserDTO;
  posts: PostDTO[];
  followers: MinimalUserDTO[];
  following: MinimalUserDTO[];
  bookshelfEntries: BookshelfEntryDTO[];
}

export interface PrivateProfileDTO extends PublicProfileDTO {
  email: string;
}
