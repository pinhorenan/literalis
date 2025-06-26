import { useSession, signIn } from 'next-auth/react';
import { useState } from 'react';
import { likePost, unlikePost, isPostLiked } from '@clients/like.client';
import { addComment } from '@clients/comment.client';
import { deletePost } from '@clients/post.client';
import type { PostDTO } from '@models/post.model';
import type { CommentDTO } from '@models/comment.model';

export default function usePostController(post: PostDTO) {
  const { data: session } = useSession();
  const isAuthenticated = !!session;
  const isAuthor = session?.user.username === post.author.username;

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [comments, setComments] = useState<CommentDTO[]>(post.comments || []);
  const [commentLoading, setCommentLoading] = useState(false);

  // check initial like state
  useState(() => {
    if (isAuthenticated) {
      isPostLiked(post.id).then((l) => setLiked(l)).catch(() => {});
    }
  });

  async function toggleLike() {
    if (!isAuthenticated) return signIn();
    setLikeLoading(true);
    try {
      if (liked) {
        await unlikePost(post.id);
        setLikeCount((c) => c - 1);
      } else {
        await likePost(post.id);
        setLikeCount((c) => c + 1);
      }
      setLiked(!liked);
    } finally {
      setLikeLoading(false);
    }
  }

  async function add(content: string) {
    if (!isAuthenticated) return signIn();
    setCommentLoading(true);
    try {
      const comment = await addComment(post.id, content);
      setComments((c) => [...c, comment]);
    } finally {
      setCommentLoading(false);
    }
  }

  async function handleDelete() {
    if (!isAuthor) return;
    await deletePost(post.id);
  }

  return {
    isAuthor,
    isAuthenticated,
    like: { liked, likeCount, loading: likeLoading, toggleLike },
    comments: { comments, loading: commentLoading, addComment: add },
    requestSignIn: () => signIn(),
    deletePost: handleDelete,
  };
}
