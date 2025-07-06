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
import { Input } from '@/components/ui/input';
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

  const { mutate: addComment } = useCommentPost(post.id);
  const authorName = post.author.name ?? post.author.username;
  const progress =
    post.currentPage && post.totalPages
      ? Math.ceil((post.currentPage / post.totalPages) * 100)
      : post.progress;

  function handleSubmitComment(e: FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;
    addComment(newComment, { onSuccess: () => setNewComment('') });
  }

  return (
    <Card className="w-full max-w-2xl">
      {/* header */}
      <CardHeader className="flex items-center justify-between border-b px-5 py-0">
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
      <CardContent className="flex gap-6 px-5">
        <BookCover
          isbn={post.book.isbn}
          width={120}
          height={180}
          className="flex-shrink-0 rounded-lg"
        />
        <div className="flex-col gap-4">
          <BookInfo isbn={post.book.isbn} />

          {post.progress !== undefined && (
            <div className="flex items-center gap-2">
              <Progress value={progress} className="h-2" />
              <span className="text-muted-foreground flex-0 text-xs">{progress}%</span>
            </div>
          )}

          <p className={clsx('mt-2 text-sm', !showFull && 'line-clamp-3')}>{post.content}</p>

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
      <CardFooter className="my-0 flex items-center justify-between gap-2 border-t px-5 py-0">
        <div className="flex items-center text-sm">
          <Button variant="ghost" className="flex items-center gap-1">
            <MessageCircle className="h-6 w-6" />
            {post.commentsCount}
          </Button>
          <Button variant="ghost" className="flex items-center gap-1">
            <Heart className={clsx('h-6 w-6', post.likedByMe && 'fill-primary text-primary')} />
            {post.likesCount}
          </Button>
        </div>
        {/* input para novo comentário */}
        <form onSubmit={handleSubmitComment} className="flex flex-1 items-center gap-2">
          <Input
            type="text"
            placeholder="Escreva um comentário..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 rounded border px-3 py-1 text-sm"
          />
          <Button variant="outline" type="submit">
            Enviar
          </Button>
        </form>
      </CardFooter>

      {/* seção de comentários */}
      <div className="border-t px-5 py-2">
        {(post.comments ?? []).map((c: Comment) => {
          const commentTime = formatDistanceToNow(c.createdAt, {
            locale: ptBR,
            addSuffix: true,
          });
          return (
            <div key={c.id} className="flex items-center gap-3 py-2">
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
      </div>
    </Card>
  );
}
