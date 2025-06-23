import type { MinimalUserDTO } from './user.dto';

export interface CommentDTO {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: MinimalUserDTO;
  postId: string;        
  likes: MinimalUserDTO[];
};