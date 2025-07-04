// src/hooks/post/usePosts.ts
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/src/data/api/posts';
import type { PostData } from '@/src/services/post.service';

export function usePosts(id: string) {
  return useQuery<PostData>(['post', id], () => api.fetchPost(id));
}

export function useUserPosts(username: string) {
  return useQuery<PostData[]>(['posts', 'user', username], () => api.fetchUserPosts(username));
}

export function useFeedPosts() {
  return useQuery<PostData[]>(['posts', 'feed'], api.fetchFeedPosts);
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation(api.createPost, {
    onSuccess: () => {
      queryClient.invalidateQueries(['posts', 'feed']);
      queryClient.invalidateQueries(['posts', 'user']);
    },
  });
}

export function useUpdatePost(id: string) {
  const queryClient = useQueryClient();
  return useMutation((data: any) => api.updatePost(id, data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['post', id]);
      queryClient.invalidateQueries(['posts', 'user']);
      queryClient.invalidateQueries(['posts', 'feed']);
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation(api.deletePost, {
    onSuccess: (_, id) => {
      queryClient.invalidateQueries(['posts', 'feed']);
      queryClient.invalidateQueries(['posts', 'user']);
      queryClient.removeQueries(['post', id]);
    },
  });
}

export function useToggleLikePost(id: string) {
  const queryClient = useQueryClient();
  return useMutation(() => api.toggleLikePost(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(['post', id]);
    },
  });
}

export function useCommentPost(id: string) {
  const queryClient = useQueryClient();
  return useMutation((content: string) => api.commentPost(id, content), {
    onSuccess: () => {
      queryClient.invalidateQueries(['post', id]);
    },
  });
}
