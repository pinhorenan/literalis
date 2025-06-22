// File: src/models/post.dto.ts
import type { UserDTO }     from '@models/user.dto';
import type { BookDTO }     from '@models/book.dto';
import type { CommentDTO }  from '@models/comment.dto';

export type PostDTO = {
    id:                 string;
    content:            string;
    progress:           number;
    createdAt:          string;
    updatedAt:          string;
    likeCount:          number;
    commentCount:       number;
    likedByMe:          boolean;
    isFollowingAuthor:  boolean;
    isInMyBookshelf:    boolean;

    author:             UserDTO;
    book:               BookDTO;
    likedBy:            UserDTO[];
    comments:           CommentDTO[];
};

export type CreatePostDTO = {
    content: string;
    progress: number;
    bookIsbn: string;
}

export type UpdatePostDTO = {
    content?: string;
    progress?: number;
};
