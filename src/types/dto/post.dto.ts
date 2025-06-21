// File: src/dto/post.dto.ts
import type { UserDTO } from '@dto/user.dto';
import type { BookDTO } from '@dto/book.dto';
import type { CommentDTO } from '@dto/comment.dto';

export type PostDTO = {
    id:                 string;
    content:            string;
    progress:           number;
    createdAt:          string;
    updatedAt:          string;

    /* agregados */
    likeCount:          number;
    commentCount:       number;
    likedByMe:          boolean;
    isFollowingAuthor:  boolean;
    isInMyBookshelf:    boolean;

    author:              UserDTO;
    book:                BookDTO;
    commentsPreview:     CommentDTO[];
};