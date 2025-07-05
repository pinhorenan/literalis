'use client';

import { useState } from 'react';
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
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import type { Post } from '@/types/post';

interface Props {
  post: Post;
}

export default function PostCard({ post }: Props) {
  const [showFull, setShowFull] = useState(false);
  const relTime = formatDistanceToNow(post.createdAt, { locale: ptBR, addSuffix: true });

  /* fallback garante string não-vazia mesmo que name seja null */
  const authorName = post.author.name ?? post.author.username;

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
    </Card>
  );
}
