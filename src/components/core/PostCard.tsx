// src/components/core/PostCard.tsx
'use client';

import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { useState, FormEvent } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import clsx from 'clsx';

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookCover, BookInfo } from '@/components/core/Book';
import { useCommentPost } from '@/hooks/post';
import type { Post, Comment } from '@/types/post';

export default function PostCard({ post }: { post: Post }) {
  const [showFull, setShowFull] = useState(false);
  const [newComment, setNewComment] = useState('');
  const relTime = formatDistanceToNow(post.createdAt, { locale: ptBR, addSuffix: true });

  const authorName = post.author.name ?? post.author.username;
  const { mutate: addComment } = useCommentPost(post.id);

  function handleSubmitComment(e: FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;
    addComment(newComment, { onSuccess: () => setNewComment('') });
  }

  return (
    <Card className="mx-auto w-full max-w-2xl">
      {/* header */}
      <CardHeader className="flex items-center justify-between border-b px-5 py-4">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={post.author.avatarUrl ?? undefined} />
            <AvatarFallback>{authorName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base">{authorName}</CardTitle>
            <CardDescription className="text-muted-foreground text-xs">{relTime}</CardDescription>
          </div>
        </div>
      </CardHeader>

      {/* corpo */}
      <CardContent className="flex gap-6 px-5 py-6">
        <BookCover book={post.book} width={80} height={120} className="flex-shrink-0 rounded-lg" />
        <div className="flex flex-1 flex-col gap-3">
          <BookInfo book={post.book} />

          {post.progress !== undefined && (
            <div className="flex items-center gap-2">
              <Progress value={post.progress} className="h-2 flex-1" />
              <span className="text-muted-foreground text-xs">{post.progress}% lido</span>
            </div>
          )}

          <p className={clsx('text-sm', !showFull && 'line-clamp-3')}>{post.content}</p>

          {post.content.length > 200 && (
            <Button
              variant="link"
              size="sm"
              className="-mt-1 p-0"
              onClick={() => setShowFull(!showFull)}
            >
              {showFull ? 'Mostrar menos' : 'Mostrar mais'}
            </Button>
          )}
        </div>
      </CardContent>

      {/* ações */}
      <CardFooter className="flex items-center justify-between border-t px-5 py-4">
        <div className="flex items-center gap-6 text-sm">
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            {post.commentsCount}
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Heart className={clsx('h-4 w-4', post.likedByMe && 'fill-primary text-primary')} />
            {post.likesCount}
          </Button>
        </div>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Share2 className="h-4 w-4" /> Compartilhar
        </Button>
      </CardFooter>

      {/* seção de comentários */}
      <div className="border-t px-5 py-4">
        {(post.comments ?? []).map((c: Comment) => {
          const commentTime = formatDistanceToNow(c.createdAt, {
            locale: ptBR,
            addSuffix: true,
          });
          return (
            <div key={c.id} className="flex gap-3 py-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={c.author.avatarUrl} />
                <AvatarFallback>{c.author.name ?? c.author.username}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm">
                  <strong>{c.author.name ?? c.author.username}</strong> {c.content}
                </p>
                <p className="text-muted-foreground text-xs">{commentTime}</p>
              </div>
            </div>
          );
        })}

        {/* input para novo comentário */}
        <form onSubmit={handleSubmitComment} className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Escreva um comentário..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 rounded border px-3 py-1 text-sm"
          />
          <Button type="submit" size="sm" disabled={!newComment.trim()}>
            Enviar
          </Button>
        </form>
      </div>
    </Card>
  );
}
