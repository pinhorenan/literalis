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
import { Input } from '@/components/ui/input';
import BookCover from '@/components/book/BookCover';
import BookInfo from '@/components/book/BookInfo';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import type { PostDTO } from '@/src/models/types/post.type';

export default function PostCard(post: PostDTO) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [openComments, setOpenComments] = useState(false);
  const [commentDraft, setCommentDraft] = useState('');

  const author = post.author;
  const book = post.book;
  const description = post.content;
  const comments = post.comments;
  const likeList = post.likeUserList;
  const relativeTime = formatDistanceToNow(post.createdAt, { locale: ptBR, addSuffix: true });

  const isFollowing = true; // todo
  const onFollow = () => prompt('seguiu'); // todo

  return (
    <Card className="mx-auto w-full max-w-2xl">
      {/* Header */}
      <CardHeader className="flex items-center justify-between border-b px-5 py-4">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={author.avatarUrl} alt={author.name} />
            <AvatarFallback>{author.name}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base">{author.name}</CardTitle>
            <CardDescription className="text-muted-foreground text-xs">
              {relativeTime}
            </CardDescription>
          </div>
        </div>
        <Button variant={isFollowing ? 'secondary' : 'outline'} size="sm" onClick={onFollow}>
          {isFollowing ? 'Seguindo' : 'Seguir'}
        </Button>
      </CardHeader>

      {/* Conteúdo do post */}
      <CardContent className="flex gap-6 px-5 py-6">
        <BookCover book={book} width={80} height={120} className="flex-shrink-0 rounded-lg" />
        <div className="flex flex-1 flex-col gap-3">
          <BookInfo book={book} />
          <div className="flex items-center gap-2">
            <Progress value={post.progress} className="h-2 flex-1" />
            <span className="text-muted-foreground text-xs">{post.progress}% lido </span>
          </div>

          {/* Descrição (conteúdo escrito pelo autor) */}
          <p
            className={clsx(
              'text-foreground text-sm transition-all',
              !showFullDescription && 'line-clamp-3',
            )}
          >
            {description}
          </p>
          {description.length > 200 && (
            <Button
              variant="link"
              size="sm"
              className="-mt-1 self-start p-0"
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              {showFullDescription ? 'Mostrar menos' : 'Mostrar mais'}
            </Button>
          )}
        </div>
      </CardContent>

      {/* Ações principais */}
      <CardFooter className="flex items-center justify-between border-t px-5 py-4">
        <div className="flex items-center gap-6 text-sm">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setOpenComments(!openComments)}
          >
            <MessageCircle className="h-4 w-4" />
            {comments.length}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1"
            onClick={
              // onLike() todo
              () => prompt('liked')
            } // TODO
          >
            <Heart className="h-4 w-4" />
            {likeList.length}
            {/* TODO AQUI ABRIR LISTA QND CLICA NO NUMERO, LIKAR QND CLICA NO CORACAO */}
          </Button>
        </div>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Share2 className="h-4 w-4" /> Compartilhar
        </Button>
      </CardFooter>

      {/* Seção de comentários */}
      {openComments && (
        <div className="space-y-4 px-5 pb-5 pt-2">
          {/* Form de comentário */}
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={author.avatarUrl} alt={author.name} />
              <AvatarFallback>{author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-1 gap-2">
              <Input
                value={commentDraft}
                onChange={(e) => setCommentDraft(e.target.value)}
                placeholder="Escreva um comentário..."
                className="flex-1"
              />
              <Button
                size="sm"
                disabled={!commentDraft.trim()}
                onClick={() => {
                  // onCommentSubmit?.(commentDraft.trim());
                  setCommentDraft('');
                }}
              >
                Enviar
              </Button>
            </div>
          </div>

          {/* Lista de comentários */}
          <div className="max-h-40 space-y-3 overflow-y-auto">
            {comments.map((c) => (
              <div key={c.id} className="flex items-start gap-3 text-sm last:mb-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={c.author.avatarUrl} />
                  <AvatarFallback>{c.author.name[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{c.author.name}</span>
                    <span className="text-muted-foreground text-xs">
                      {formatDistanceToNow(new Date(c.createdAt), {
                        locale: ptBR,
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p>{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
