// src/components/core/PostCard.tsx
'use client';

import { useState } from 'react';
import { Heart, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { BookCover } from '@/components/core/Book';
import type { Post, Comment } from '@/types/post';

export default function PostCard({ post }: { post: Post }) {
  const [showAllComments, setShowAllComments] = useState(false);
  const relTime = formatDistanceToNow(post.createdAt, { locale: ptBR, addSuffix: true });

  const authorName = post.author.name ?? post.author.username;
  const progress =
    post.currentPage && post.totalPages
      ? Math.ceil((post.currentPage / post.totalPages) * 100)
      : post.progress;

  // Limite de comentários visíveis
  const COMMENTS_LIMIT = 2;
  const visibleComments = showAllComments ? post.comments : post.comments?.slice(0, COMMENTS_LIMIT);
  const hasMoreComments = (post.comments?.length ?? 0) > COMMENTS_LIMIT;

  return (
    <article className="border-border bg-card mx-auto w-full max-w-2xl rounded-2xl border shadow-sm transition-all duration-200 hover:shadow-md">
      {/* Header - author info */}
      <div className="flex items-center gap-3 p-4 sm:p-6">
        <Avatar className="ring-border h-12 w-12 ring-1">
          <AvatarImage src={post.author.avatarUrl ?? undefined} />
          <AvatarFallback className="from-primary/20 to-secondary/20 bg-gradient-to-br font-semibold">
            {authorName[0]}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="text-foreground truncate text-lg font-semibold">{authorName}</div>
          <div className="text-muted-foreground text-xs">{relTime}</div>
        </div>
      </div>

      {/* Book and progress section */}
      <div className="flex flex-col gap-4 px-4 pb-4 sm:flex-row sm:gap-6 sm:px-6 sm:pb-6">
        {/* Book cover */}
        <div className="flex justify-center sm:justify-start">
          <BookCover
            isbn={post.book.isbn}
            width={120}
            height={180}
            className="rounded-xl shadow-sm"
            book={{ isbn: post.book.isbn, coverUrl: post.book.coverUrl }}
          />
        </div>

        {/* Book info and progress */}
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {/* Title and author */}
          <div className="text-center sm:text-left">
            <h3 className="text-primary text-xl font-bold leading-tight sm:text-2xl">
              {post.book.title}
            </h3>
            <p className="text-foreground mt-1 text-base">por {post.book.authors[0]?.name}</p>
          </div>

          {/* Book metadata */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <span className="text-muted-foreground text-xs">{post.book.totalPages} páginas</span>
            <span className="text-muted-foreground text-xs">•</span>
            <span className="text-muted-foreground text-xs">{post.book.language}</span>
          </div>

          {/* Progress bar */}
          {progress !== undefined && (
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-foreground text-sm font-medium">Progresso de leitura</span>
                <span className="text-foreground text-sm font-semibold">{progress}%</span>
              </div>
              <div className="bg-muted h-2 overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Post content */}
      {post.content && (
        <div className="text-foreground px-4 pb-4 text-base leading-relaxed sm:px-6 sm:pb-6">
          {post.content}
        </div>
      )}

      {/* Actions */}
      <div className="border-border flex items-center gap-6 border-t px-4 py-3 sm:px-6 sm:py-4">
        <button
          className="text-primary hover:text-foreground flex items-center gap-2 transition-colors"
          aria-label="Curtir"
        >
          <Heart className="h-5 w-5" />
          <span className="text-sm font-medium">{post.likesCount}</span>
        </button>
        <button
          className="text-foreground hover:text-primary flex items-center gap-2 transition-colors"
          aria-label="Comentar"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-sm font-medium">Comentar</span>
        </button>
      </div>

      {/* Seção de comentários */}
      {post.comments && post.comments.length > 0 && (
        <div className="border-border/50 bg-muted/10 border-t">
          {visibleComments?.map((c: Comment) => {
            const commentTime = formatDistanceToNow(c.createdAt, {
              locale: ptBR,
              addSuffix: true,
            });
            return (
              <div
                key={c.id}
                className="hover:bg-muted/30 flex items-start gap-3 px-4 py-3 transition-colors sm:px-6"
              >
                <Avatar className="ring-border h-8 w-8 flex-shrink-0 ring-1">
                  <AvatarImage src={c.author.avatarUrl} />
                  <AvatarFallback className="text-xs font-medium">
                    {(c.author.name ?? c.author.username)[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="bg-muted/50 rounded-lg px-3 py-2">
                    <p className="text-sm leading-relaxed">
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
          
          {/* Botão "Ver mais comentários" */}
          {hasMoreComments && (
            <div className="border-border/30 border-t px-4 py-2 sm:px-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllComments(!showAllComments)}
                className="text-primary hover:text-primary/80 hover:bg-primary/10 flex w-full items-center justify-center gap-2 text-sm font-medium"
              >
                {showAllComments ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Mostrar menos comentários
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Ver mais {(post.comments?.length ?? 0) - COMMENTS_LIMIT} comentário
                    {(post.comments?.length ?? 0) - COMMENTS_LIMIT !== 1 ? 's' : ''}
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
