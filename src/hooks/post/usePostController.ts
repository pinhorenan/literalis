'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import usePostLike from './usePostLike';
import usePostComments from './usePostComments';
import { updatePostRequest, deletePostRequest } from '@services/client/post.service';

import type { PostDTO, UpdatePostDTO } from '@models/post.dto';
import { toast } from 'react-hot-toast';

export default function usePostController(post: PostDTO) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAuthor = session?.user.username === post.author.username;
  const isAuthenticated = status === 'authenticated';

  const like = usePostLike(post.id, post.likedByMe, post.likeCount);
  const comments = usePostComments(post.id, post.comments);

  function requestSignIn() {
    router.push('/signin');
  }

  async function deletePost() {
    try {
      await deletePostRequest(post.id);
      toast.success('Post removido');
      router.refresh();
    } catch {
      toast.error('Erro ao remover post');
    }
  }

  async function editPost(data: UpdatePostDTO) {
    try {
      await updatePostRequest(post.id, data);
      toast.success('Post atualizado');
      router.refresh();
    } catch {
      toast.error('Erro ao editar post');
    }
  }

  return { 
    isAuthor,
    isAuthenticated,
    like,
    comments,
    requestSignIn,
    deletePost,
    editPost,
  };
}
