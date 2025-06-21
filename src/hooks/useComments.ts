// src/hooks/useComments.ts
import { useState, useCallback } from 'react';
import { PostService } from '@services/PostService';
import type { CommentDTO } from '@dto/comment.dto';

export default function useComments(postId: string, initial: CommentDTO[]) {
  const [comments, setComments] = useState<CommentDTO[]>(initial);
  const [loading, setLoading]   = useState(false);

  const addComment = useCallback(async (content: string) => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const newC = await PostService.addComment(postId, content);
      setComments(prev => [newC, ...prev]);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  return { comments, loading, addComment };
}
