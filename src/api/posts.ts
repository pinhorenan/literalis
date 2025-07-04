// src/api/posts.ts
import type { PostData } from '@/types/post';

export async function fetchPost(id: string): Promise<PostData> {
  /* GET /api/posts/:id */
}
export async function fetchUserPosts(username: string): Promise<PostData[]> {
  /* GET /api/posts/user/:username */
}
export async function fetchFeedPosts(): Promise<PostData[]> {
  /* GET /api/posts/feed */
}

export async function createPost(data: {
  bookIsbn: string;
  content: string;
  progress?: number;
  currentPage?: number;
  totalPages?: number;
  rating?: number;
}): Promise<PostData> {
  /* POST /api/posts */
}

export async function deletePost(id: string): Promise<void> {
  /* DELETE /api/posts/:id */
}

export async function toggleLikePost(id: string): Promise<{ liked: boolean; likesCount: number }> {
  /* POST/ api/posts/:id/like */
}

export async function commentPost(id: string, content: string): Promise<CommentData> {
  /* POST /api/posts/:id/comments */
}
