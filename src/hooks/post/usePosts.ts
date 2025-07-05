// src/hooks/post/usePosts.ts
'use client';

import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  QueryFunctionContext,
  InfiniteData,
} from '@tanstack/react-query';

import * as api from '@/api/posts';
import type { Post, Comment } from '@/types/post';
import type { Paginated } from '@/types/common';

export function usePost(id: string) {
  return useQuery<Post, Error>({
    queryKey: ['post', id],
    queryFn: () => api.fetchPost(id),
    enabled: Boolean(id),
  });
}

export function useUserPosts(username: string) {
  return useInfiniteQuery<
    Paginated<Post>,
    Error,
    Paginated<Post>,
    ['posts', 'user', string],
    string | undefined
  >({
    queryKey: ['posts', 'user', username],
    queryFn: ({ pageParam }: QueryFunctionContext<['posts', 'user', string], string | undefined>) =>
      api.fetchUserPosts(username, pageParam),
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    initialPageParam: undefined,
    enabled: Boolean(username),
  });
}

export function useFeedPosts() {
  return useInfiniteQuery<
    Paginated<Post>,
    Error,
    Paginated<Post>,
    ['posts', 'feed'],
    string | undefined
  >({
    queryKey: ['posts', 'feed'],
    queryFn: async ({ pageParam }) => {
      const raw = await api.fetchFeedPosts(pageParam);
      /* converte strings ISO em Date */
      return {
        ...raw,
        items: raw.items.map((p) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
        })),
      };
    },
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    initialPageParam: undefined,
  });
}

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation<Post, Error, Parameters<typeof api.createPost>[0]>({
    mutationFn: (data) => api.createPost(data),
    onSuccess: (_newPost, _vars) => {
      qc.invalidateQueries({ queryKey: ['posts', 'feed'] });
      qc.invalidateQueries({ queryKey: ['posts', 'user'] });
    },
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (postId) => api.deletePost(postId),
    onSuccess: (_data, postId) => {
      qc.invalidateQueries({ queryKey: ['posts', 'feed'] });
      qc.invalidateQueries({ queryKey: ['posts', 'user'] });
      qc.removeQueries({ queryKey: ['post', postId] });
    },
  });
}

export function useToggleLikePost(id: string) {
  const qc = useQueryClient();
  return useMutation<{ liked: boolean; likesCount: number }, Error, void>({
    mutationFn: () => api.toggleLikePost(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['post', id] });
    },
  });
}

export function useCommentPost(id: string) {
  const qc = useQueryClient();
  return useMutation<Comment, Error, string>({
    mutationFn: (content) => api.commentPost(id, content),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['post', id] });
    },
  });
}
