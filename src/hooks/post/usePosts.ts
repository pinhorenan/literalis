// src/hooks/post/usePosts.ts
'use client';

import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  QueryFunctionContext,
} from '@tanstack/react-query';

import * as api from '@/src/api/posts';
import type { Post, Comment } from '@/types/post';
import type { Paginated } from '@/types/common';

/** Fetch a single post */
export function usePost(id: string) {
  return useQuery<Post, Error>({
    queryKey: ['post', id],
    queryFn: () => api.fetchPost(id),
    enabled: Boolean(id),
  });
}

/** Fetch posts by user (cursor-based) */
export function useUserPosts(username: string) {
  return useInfiniteQuery<
    Paginated<Post>, // TQueryFnData
    Error, // TError
    Paginated<Post>, // TData
    ['posts', 'user', string], // TQueryKey
    string | undefined // TPageParam
  >({
    queryKey: ['posts', 'user', username],
    queryFn: ({ pageParam }: QueryFunctionContext<['posts', 'user', string], string | undefined>) =>
      api.fetchUserPosts(username, pageParam),
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    initialPageParam: undefined,
    enabled: Boolean(username),
  });
}

/** Fetch feed posts (cursor-based) */
export function useFeedPosts() {
  return useInfiniteQuery<
    Paginated<Post>, // TQueryFnData
    Error, // TError
    Paginated<Post>, // TData
    ['posts', 'feed'], // TQueryKey
    string | undefined // TPageParam
  >({
    queryKey: ['posts', 'feed'],
    queryFn: ({ pageParam }) => api.fetchFeedPosts(pageParam),
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    initialPageParam: undefined,
  });
}

/** Create a new post */
export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation<
    Post, // TData
    Error, // TError
    Parameters<typeof api.createPost>[0] // TVariables
  >({
    mutationFn: (data) => api.createPost(data),
    onSuccess: (_newPost, _vars) => {
      qc.invalidateQueries({ queryKey: ['posts', 'feed'] });
      qc.invalidateQueries({ queryKey: ['posts', 'user'] });
    },
  });
}

/** Delete a post */
export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation<
    void, // TData
    Error, // TError
    string // TVariables (post ID)
  >({
    mutationFn: (postId) => api.deletePost(postId),
    onSuccess: (_data, postId) => {
      qc.invalidateQueries({ queryKey: ['posts', 'feed'] });
      qc.invalidateQueries({ queryKey: ['posts', 'user'] });
      qc.removeQueries({ queryKey: ['post', postId] });
    },
  });
}

/** Toggle like/unlike on a post */
export function useToggleLikePost(id: string) {
  const qc = useQueryClient();
  return useMutation<
    { liked: boolean; likesCount: number }, // TData
    Error, // TError
    void // TVariables
  >({
    mutationFn: () => api.toggleLikePost(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['post', id] });
    },
  });
}

/** Add a comment to a post */
export function useCommentPost(id: string) {
  const qc = useQueryClient();
  return useMutation<
    Comment, // TData
    Error, // TError
    string // TVariables (comment content)
  >({
    mutationFn: (content) => api.commentPost(id, content),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['post', id] });
    },
  });
}
