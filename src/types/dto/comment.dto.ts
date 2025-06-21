// File: src/dto/comment.dto.ts
import type { UserDTO } from '@dto/user.dto';

export type CommentDTO = {
    id:         string;
    content:    string;
    createdAt:  string;
    updatedAt:  string;
    likeCount:  number;
    likedByMe:  boolean;
    
    author:     UserDTO;
};