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
    <article className="w-full max-w-2xl bg-card rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      {/* header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="ring-2 ring-background shadow-sm">
              <AvatarImage src={post.author.avatarUrl ?? undefined} />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 font-semibold">
                {authorName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
          </div>
          <div className="flex flex-col">
            <div className="text-base font-semibold hover:text-primary transition-colors cursor-pointer">
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
            className="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          />
        </div>
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          <div className="space-y-2">
            <BookInfo isbn={post.book.isbn} />
          </div>

          {post.progress !== undefined && (
            <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
              <div className="flex-1">
                <Progress value={progress} className="h-2.5" />
              </div>
              <span className="text-muted-foreground text-sm font-medium min-w-0 whitespace-nowrap">
                {progress}%
              </span>
            </div>
          )}

          <div className="space-y-2">
            <p className={clsx(
              'text-sm leading-relaxed text-foreground/90',
              !showFull && 'line-clamp-3'
            )}>
              {post.content}
            </p>

            {post.content.length > 200 && (
              <Button
                variant="link"
                size="sm"
                className="p-0 h-auto text-primary font-medium hover:text-primary/80 transition-colors"
                onClick={() => setShowFull(!showFull)}
              >
                {showFull ? 'Mostrar menos' : 'Mostrar mais'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ações */}
      <div className="border-t border-border/50 bg-muted/20">
        <div className="flex items-center justify-between gap-2 px-4 py-3">
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm"
              className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-all duration-200"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">{post.commentsCount}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className={clsx(
                "flex items-center gap-2 transition-all duration-200",
                post.likedByMe 
                  ? "text-red-500 hover:bg-red-50 hover:text-red-600" 
                  : "hover:bg-red-50 hover:text-red-500"
              )}
            >
              <Heart className={clsx('w-4 h-4', post.likedByMe && 'fill-current')} />
              <span className="text-sm font-medium">{post.likesCount}</span>
            </Button>
          </div>
          
          {/* input para novo comentário */}
          <form onSubmit={handleSubmitComment} className="flex flex-1 items-center gap-2 ml-4">
            <Input
              type="text"
              placeholder="Escreva um comentário..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 text-sm bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
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
        <div className="border-t border-border/50 bg-muted/10">
          {post.comments.map((c: Comment) => {
            const commentTime = formatDistanceToNow(c.createdAt, {
              locale: ptBR,
              addSuffix: true,
            });
            return (
              <div key={c.id} className="flex items-start gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                <Avatar className="w-8 h-8 ring-1 ring-border">
                  <AvatarImage src={c.author.avatarUrl} />
                  <AvatarFallback className="text-xs font-medium">
                    {(c.author.name ?? c.author.username)[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="bg-muted/50 rounded-lg px-3 py-2">
                    <p className="text-sm">
                      <span className="font-semibold text-foreground">
                        {c.author.name ?? c.author.username}
                      </span>{' '}
                      <span className="text-foreground/90">{c.content}</span>
                    </p>
                  </div>
                  <p className="text-muted-foreground text-xs mt-1 font-medium">{commentTime}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
}
