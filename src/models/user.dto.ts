import { PostDTO } from './post.dto';
import { BookshelfEntryDTO } from './bookshelf-entry.dto';

export interface MinimalUserDTO {
    username: string;
    name: string;
    avatarUrl: string;
};

export interface UserDTO extends MinimalUserDTO {
    bio: string;
    createdAt: Date;
    updatedAt: Date;
};

export interface UserProfileDTO extends UserDTO {
    posts: PostDTO[];
    followers: MinimalUserDTO[];
    following: MinimalUserDTO[];
    bookshelfEntries: BookshelfEntryDTO[];
};

export interface UserPrivateDTO extends UserProfileDTO {
    email: string;
};