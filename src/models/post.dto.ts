// File: src/models/post.dto.ts
import type { CommentDTO }      from '@models/comment.dto';
import type { UserBookDTO }     from '@models/userBook.dto';
import type { PublicUserDTO }   from '@models/user.dto';

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

    userBook: {
        user: PublicUserDTO;
        book: UserBookDTO['book'];
        currentPage: number;
        isPrivate: boolean;
    };

    likedBy:            PublicUserDTO[];
    comments:           CommentDTO[];
};

export type CreatePostDTO = {
    book: UserBookDTO['book'];
    content: string;
    progress: number;
}

export type UpdatePostDTO = {
    content?: string;
    progress?: number;
};
