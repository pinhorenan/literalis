// src/models/profile.model.ts
import { BookshelfEntryDTO } from './bookshelf-entry.model';
import { PostDTO } from './post.model';
import { MinimalUserDTO, UserDTO } from './user.model';

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
