import { db } from '@lib/db';
import { postInclude } from '@includes/post.include';
import { CreatePostDTO, UpdatePostDTO } from '@models/post.dto';

export const PostRepository = {
  findById: (id: string) => {
    return db.post.findUnique({
      where: { id },
      include: postInclude,
    });
  },

  findByUser: (username: string) => {
    return db.post.findMany({
      where: {
        userBook: {
          userUsername: username,
        },
      },
      include: postInclude,
      orderBy: { createdAt: 'desc' },
    });
  },

  findByBook: (isbn: string) => {
    return db.post.findMany({
      where: {
        bookIsbn: isbn,
      },
      include: postInclude,
      orderBy: { createdAt: 'desc' },
    });
  },

  create: (userUsername: string,bookIsbn: string,data: CreatePostDTO ) => {
    return db.post.create({
      data: {
        ...data,
        userUsername,
        bookIsbn,
      },
      include: postInclude,
    });
  },

  update: (postId: string, data: Partial<UpdatePostDTO>) => {
    return db.post.update({
      where: { id: postId },
      data,
      include: postInclude,
    });
  },

  delete: (postId: string) => {
    return db.post.delete({
      where: { id: postId },
    });
  },
};
