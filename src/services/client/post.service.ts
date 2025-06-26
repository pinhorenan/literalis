import { editPost } from '@clients/post.client';
import type { PostDTO } from '@models/post.model';

export interface UpdatePostDTO {
  content: string;
  progress?: number;
}

export async function updatePostRequest(
  postId: string,
  data: UpdatePostDTO,
): Promise<PostDTO> {
  const payload: any = { content: data.content };
  return editPost(postId, payload);
}
