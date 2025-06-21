// File: src/services/PostService.ts
import { httpClient } from '@services/HTTPClient';
import type { PostDTO } from '@dto/post.dto';
import type { CommentDTO } from '@dto/comment.dto';

export const PostService = {
  /* ------------------------------------------------------------------------ */
  /* Posts                                                                    */
  /* ------------------------------------------------------------------------ */
  create: (bookIsbn: string, content: string, progress: number) =>
    httpClient.post<PostDTO>('/api/posts', { bookIsbn, content, progress }),

  get: (id: string) => httpClient.get<PostDTO>(`/api/posts/${id}`),

  update: (id: string, data: Partial<Pick<PostDTO, 'content' | 'progress'>>) =>
    httpClient.patch<PostDTO>(`/api/posts/${id}`, data),

  delete: (id: string) => httpClient.del<{ deleted: boolean }>(`/api/posts/${id}`),

  /* ------------------------------------------------------------------------ */
  /* Likes                                                                    */
  /* ------------------------------------------------------------------------ */
  toggleLike: (id: string) =>
    httpClient.post<{ likeCount: number; likedByMe: boolean }>(`/api/posts/${id}/like`),

  /* ------------------------------------------------------------------------ */
  /* Comments                                                                 */
  /* ------------------------------------------------------------------------ */
  addComment: (id: string, content: string) =>
    httpClient.post<CommentDTO>(`/api/posts/${id}/comments`, { content }),

  comments: (id: string, limit = 20, cursor?: string) =>
    httpClient.get<CommentDTO[]>(`/api/posts/${id}/comments`, { params: { limit, cursor } }),

  updateComment: (id: string, commentId: string, content: string) =>
    httpClient.patch<CommentDTO>(`/api/posts/${id}/comments/${commentId}`, { content }),

  deleteComment: (id: string, commentId: string) =>
    httpClient.del<{ deleted: boolean }>(`/api/posts/${id}/comments/${commentId}`),
};