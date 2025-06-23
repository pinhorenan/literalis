// src/lib/mappers/userBook.mapper.ts
import type { BookshelfDTO } from '@/src/models/bookshelf.dto';

export function toUserBookDTO(entry: any, viewerUsername: string | null): BookshelfDTO {
  const { user, book, ...rest } = entry;

  return {
    ...rest,
    addedAt: entry.addedAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
    user: {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      isMe: viewerUsername === user.username,
      isFollower: !!user.followers?.some((f: { followerUsername: string}) => f.followerUsername === viewerUsername),
      isFollowing: !!user.following?.some((f: { followedUsername: string} )=> f.followedUsername === viewerUsername),
    },
    book: {
      ...book,
      publicationDate: book.publicationDate?.toISOString(),
    },
  };
}
