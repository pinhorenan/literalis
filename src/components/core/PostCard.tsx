// src/components/core/PostCard.tsx
'use client';

import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { useState, FormEvent } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import clsx from 'clsx';

import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookCover, BookInfo } from '@/components/core/Book';
import { useCommentPost, useToggleLikePost } from '@/hooks/post';
import type { Post, Comment } from '@/types/post';

export default function PostCard({ post }: { post: Post }) {
  const [showFull, setShowFull] = useState(false);
  const [newComment, setNewComment] = useState('');
  const relTime = formatDistanceToNow(post.createdAt, { locale: ptBR, addSuffix: true });

  const { mutate: addComment } = useCommentPost(post.id);
  const { mutate: toggleLike } = useToggleLikePost(post.id);
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

  function handleToggleLike() {
    toggleLike();
  }

  return (
    <article className="bg-card w-full max-w-2xl rounded-lg border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      {/* header */}
      <div className="border-border/50 flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="ring-background shadow-sm ring-2">
              <AvatarImage src={post.author.avatarUrl ?? undefined} />
              <AvatarFallback className="from-primary/20 to-secondary/20 bg-gradient-to-br font-semibold">
                {authorName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="border-background absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 bg-green-500" />
          </div>
          <div className="flex flex-col">
            <div className="hover:text-primary cursor-pointer text-base font-semibold transition-colors">
              {authorName}
            </div>
            <div className="text-muted-foreground text-xs font-medium">{relTime}</div>
          </div>
        </div>
      </div>

      {/* corpo */}
      <div className="flex gap-4 p-4 md:gap-6 md:p-6">
        <div className="flex-shrink-0">
          <BookCover
            isbn={post.book.isbn}
            width={120}
            height={180}
            className="rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="space-y-2">
            <BookInfo isbn={post.book.isbn} />
          </div>

          {post.progress !== undefined && (
            <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-3">
              <div className="flex-1">
                <Progress value={progress} className="h-2.5" />
              </div>
              <span className="text-muted-foreground min-w-0 whitespace-nowrap text-sm font-medium">
                {progress}%
              </span>
            </div>
          )}

          <div className="space-y-2">
            <p
              className={clsx(
                'text-foreground/90 text-sm leading-relaxed',
                !showFull && 'line-clamp-3',
              )}
            >
              {post.content}
            </p>

            {post.content.length > 200 && (
              <Button
                variant="link"
                size="sm"
                className="text-primary hover:text-primary/80 h-auto p-0 font-medium transition-colors"
                onClick={() => setShowFull(!showFull)}
              >
                {showFull ? 'Mostrar menos' : 'Mostrar mais'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ações */}
      <div className="border-border/50 bg-muted/20 border-t">
        <div className="flex items-center justify-between gap-2 px-4 py-3">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-primary/10 hover:text-primary flex items-center gap-2 transition-all duration-200"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm font-medium">{post.commentsCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleLike}
              className={clsx(
                'flex items-center gap-2 transition-all duration-200',
                post.likedByMe
                  ? 'text-red-500 hover:bg-red-50 hover:text-red-600'
                  : 'hover:bg-red-50 hover:text-red-500',
              )}
            >
              <Heart className={clsx('h-4 w-4', post.likedByMe && 'fill-current')} />
              <span className="text-sm font-medium">{post.likesCount}</span>
            </Button>
          </div>

          {/* input para novo comentário */}
          <form onSubmit={handleSubmitComment} className="ml-4 flex flex-1 items-center gap-2">
            <Input
              type="text"
              placeholder="Escreva um comentário..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="bg-background/50 border-border/50 focus:border-primary/50 flex-1 text-sm transition-colors"
            />
            <Button
              variant="outline"
              type="submit"
              size="sm"
              className="hover:bg-primary hover:text-primary-foreground transition-colors"
              disabled={!newComment.trim()}
            >
              Enviar
            </Button>
          </form>
        </div>
      </div>

      {/* seção de comentários */}
      {post.comments && post.comments.length > 0 && (
        <div className="border-border/50 bg-muted/10 border-t">
          {post.comments.map((c: Comment) => {
            const commentTime = formatDistanceToNow(c.createdAt, {
              locale: ptBR,
              addSuffix: true,
            });
            return (
              <div
                key={c.id}
                className="hover:bg-muted/30 flex items-start gap-3 px-4 py-3 transition-colors"
              >
                <Avatar className="ring-border h-8 w-8 ring-1">
                  <AvatarImage src={c.author.avatarUrl} />
                  <AvatarFallback className="text-xs font-medium">
                    {(c.author.name ?? c.author.username)[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="bg-muted/50 rounded-lg px-3 py-2">
                    <p className="text-sm">
                      <span className="text-foreground font-semibold">
                        {c.author.name ?? c.author.username}
                      </span>{' '}
                      <span className="text-foreground/90">{c.content}</span>
                    </p>
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs font-medium">{commentTime}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
}
