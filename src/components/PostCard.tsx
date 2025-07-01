'use client';

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
  CardAction,
} from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import BookCover from '@/components/book/BookCover';
import BookInfo from '@/components/book/BookInfo';
import { Heart, MessageCircle } from 'lucide-react';

// temp
type User = {
  name: string;
  avatarUrl?: string;
};
type Comment = {
  id: number;
  user: User;
  text: string;
  createdAt: string;
};
type Props = {
  author: User; // MinimalUserDTO
  isFollowing?: boolean; // Vem da relação Follow (followerUsername_followingUsername)
  postedAt: string; // Date
  book: any; // BookDTO
  progress: number; // derivado
  description: string; // conteúdo principal
  likes: number; // Vai ser uma lista PostLike[], o number vai vir de um _count
  comments: Comment[]; // CommentDTO, vai ter _count tb p/ isso
  onFollow?: () => void; // Create new follow relantionship (viewerUsername_authorUsername)
  onLike?: () => void; // Create new PostLike
};

export default function PostCard({
  author,
  isFollowing,
  postedAt,
  book,
  progress,
  description,
  likes,
  comments,
  onFollow,
  onLike,
}: Props) {
  return (
    <Card className="mx-auto w-full max-w-2xl gap-0">
      <CardHeader className="flex items-center gap-4 border-b">
        <Avatar>
          <AvatarImage src={author.avatarUrl} alt={author.name} />
          <AvatarFallback>{author.name}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-base">{author.name}</CardTitle>
          <CardDescription className="text-xs">{postedAt}</CardDescription>
        </div>
        <CardAction>
          <Button
            variant={isFollowing ? 'secondary' : 'outline'}
            size="sm"
            className="px-3"
            onClick={onFollow}
          >
            {isFollowing ? 'Seguindo' : 'Seguir'}
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-row gap-6 py-6">
        <BookCover book={book} width={80} height={120} className="max=h-[120px] min-w-[80px]" />

        <div className="flex flex-1 flex-col gap-1">
          <BookInfo book={book} />
          <div className="flex items-center gap-2">
            <Progress value={progress} className="h-2 w-32" />
            <span className="text-muted-foreground text-xs">{progress}% lido </span>
          </div>
          <div className="line-clamp-3 text-sm">{description}</div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-center justify-start gap-2 border-t pt-2">
        <div className="border-accent flex w-full justify-start gap-4">
          <Input placeholder="Escreva um comentário..." className="" />
          <div className="flex flex-1 items-center gap-4">
            <div className="text-muted-foreground flex items-center text-sm">
              <MessageCircle className="mr-1 size-4" /> {comments.length}
            </div>
            <Button variant="ghost" size="sm" className="p-2" onClick={onLike}>
              <Heart className="mr-1" /> {likes}
            </Button>
          </div>
        </div>

        <div className="mt-2 flex max-h-28 w-full flex-col gap-1 overflow-y-auto">
          {comments.map((c) => (
            <div key={c.id} className="flex items-center gap-2 text-sm">
              <Avatar className="size-8">
                <AvatarImage src={c.user.avatarUrl} />
                <AvatarFallback>{c.user.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <span className="mr-2 font-bold">{c.user.name}</span>
                <span className="text-muted-foreground text-xs">{c.createdAt}</span>
                <div>{c.text}</div>
              </div>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
