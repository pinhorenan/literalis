'use client';

import { useState } from 'react';
import { createCommentRequest } from '@services/client/post.service';
import type { CommentDTO } from '@models/comment.dto';
import { toast } from 'react-hot-toast';

export default function usePostComments(postId: string, initial: CommentDTO[] = []) {
  const [comments, setComments] = useState<CommentDTO[]>(initial);
  const [loading, setLoading] = useState(false);

  async function addComment(content: string) {
    if (!content.trim()) return;

    setLoading(true);
    try {
      const newComment = await createCommentRequest(postId, content);
      setComments(prev => [...prev, newComment]);
      toast.success('Comentário adicionado');
    } catch (err) {
      toast.error('Erro ao comentar');
    } finally {
      setLoading(false);
    }
  }

  return { comments, addComment, loading };
}
