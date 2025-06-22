// File: src/models/comment.dto.ts
import type { PublicUserDTO } from '@models/user.dto';

export type CommentDTO = {
    id:         string;
    content:    string;
    createdAt:  string;
    updatedAt:  string;
    likeCount:  number;
    likedByMe:  boolean;
    
    author:     PublicUserDTO;
    likedBy?:   PublicUserDTO[];
};

export type CreateCommentDTO = { content: string };

export type UpdateCommentDTO = Partial<Pick<CommentDTO, 'content'>>;
