// File: src/services/PostService.ts
import { httpClient } from '@services/HTTPClient';
import type { PostDTO } from '@dto/post.dto';
import type { CommentDTO } from '@dto/comment.dto';

export const PostService = {
  /* ------------------------------------------------------------------------ */
  /* Posts                                                                    */
  /* ------------------------------------------------------------------------ */
  create: (bookIsbn: string, excerpt: string, progress: number) =>
    httpClient.post<PostDTO>('/api/posts', { bookIsbn, excerpt, progress }),

  get: (postId: string) => httpClient.get<PostDTO>(`/api/posts/${postId}`),

  update: (postId: string, data: Partial<Pick<PostDTO, 'content' | 'progress'>>) =>
    httpClient.patch<PostDTO>(`/api/posts/${postId}`, data),

  delete: (postId: string) => httpClient.del<{ deleted: boolean }>(`/api/posts/${postId}`),

  /* ------------------------------------------------------------------------ */
  /* Likes                                                                    */
  /* ------------------------------------------------------------------------ */
  toggleLike: (postId: string) =>
    httpClient.post<{ likeCount: number; likedByMe: boolean }>(`/api/posts/${postId}/like`),

  /* ------------------------------------------------------------------------ */
  /* Comments                                                                 */
  /* ------------------------------------------------------------------------ */
  addComment: (postId: string, content: string) =>
    httpClient.post<CommentDTO>(`/api/posts/${postId}/comments`, { content }),

  comments: (postId: string, limit = 20, cursor?: string) =>
    httpClient.get<CommentDTO[]>(`/api/posts/${postId}/comments`, { params: { limit, cursor } }),

  updateComment: (postId: string, commentId: string, content: string) =>
    httpClient.patch<CommentDTO>(`/api/posts/${postId}/comments/${commentId}`, { content }),

  deleteComment: (postId: string, commentId: string) =>
    httpClient.del<{ deleted: boolean }>(`/api/posts/${postId}/comments/${commentId}`),
};