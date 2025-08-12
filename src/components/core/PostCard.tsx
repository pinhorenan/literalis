// src/components/core/PostCard.tsx
'use client';

import { Heart, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { BookCover } from '@/components/core/Book';
import type { Post, Comment } from '@/types/post';

export default function PostCard({ post }: { post: Post }) {
  const relTime = formatDistanceToNow(post.createdAt, { locale: ptBR, addSuffix: true });

  const authorName = post.author.name ?? post.author.username;
  const progress =
    post.currentPage && post.totalPages
      ? Math.ceil((post.currentPage / post.totalPages) * 100)
      : post.progress;

  return (
    <article className="border-border bg-card w-full rounded-2xl border p-4 shadow-sm transition-all duration-200 hover:shadow-md sm:p-6">
      {/* Header - author info */}
      <div className="mb-4 flex items-center gap-3">
        <Avatar className="ring-border h-12 w-12 ring-1">
          <AvatarImage src={post.author.avatarUrl ?? undefined} />
          <AvatarFallback className="from-primary/20 to-secondary/20 bg-gradient-to-br font-semibold">
            {authorName[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="text-foreground text-lg font-semibold">{authorName}</div>
          <div className="text-muted-foreground text-xs">{relTime}</div>
        </div>
      </div>

      {/* Book and progress section */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:gap-6">
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
        <div className="flex flex-1 flex-col gap-3">
          {/* Title and author */}
          <div className="text-center sm:text-left">
            <h3 className="text-primary text-xl font-bold sm:text-2xl">{post.book.title}</h3>
            <p className="text-foreground text-base">por {post.book.authors[0]?.name}</p>
          </div>

          {/* Book metadata */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <span className="text-muted-foreground text-xs">{post.book.totalPages} páginas</span>
            <span className="text-muted-foreground text-xs">•</span>
            <span className="text-muted-foreground text-xs">{post.book.language}</span>
          </div>

          {/* Progress bar */}
          {progress !== undefined && (
            <div className="w-full">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-foreground text-sm">Progresso de leitura</span>
                <span className="text-foreground text-sm font-medium">{progress}%</span>
              </div>
              <div className="bg-muted h-2 rounded-full">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Post content */}
      {post.content && (
        <div className="text-foreground mb-4 text-base leading-relaxed">{post.content}</div>
      )}

      {/* Actions */}
      <div className="border-border flex items-center gap-6 border-t pt-3">
        <button
          className="text-primary hover:text-foreground flex items-center gap-2 transition"
          aria-label="Curtir"
        >
          <Heart className="h-5 w-5" />
          <span className="text-sm font-medium">{post.likesCount}</span>
        </button>
        <button
          className="text-foreground hover:text-primary flex items-center gap-2 transition"
          aria-label="Comentar"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-sm">Comentar</span>
        </button>
      </div>

      {/* seção de comentários (mantido igual) */}
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
