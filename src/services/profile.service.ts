// src/services/profile.service.ts
import { bookRepository } from '@repositories/book.repository';
import { bookshelfRepository } from '@repositories/bookshelf.repository';
import { commentRepository } from '@repositories/comment.repository';
import { commentLikeRepository } from '@repositories/commentLike.repository';
import { followRepository } from '@repositories/follow.repository';
import { postRepository } from '@repositories/post.repository';
import { postLikeRepository } from '@repositories/postLike.repository';
import { userRepository } from '@repositories/user.repository';

import { BookshelfEntryDTO, mapEntryToDTO } from '@models/bookshelf-entry.model';
import { CommentDTO, mapCommentToDTO } from '@models/comment.model';
import { mapPostToDTO, PostDTO } from '@models/post.model';
import { PublicProfileDTO } from '@models/profile.model';
import { mapUserToDTO, mapUserToMinimalDTO } from '@models/user.model';

export class ProfileService {
  /**
   * GET /api/profile/:username
   * Path param: username
   * Retorna um PublicProfileDTO conforme USER-001
   */
  async getPublicProfile(username: string, currentUser?: string): Promise<PublicProfileDTO> {
    const user = await userRepository.findByUsername(username);
    if (!user) throw new Error('Usuário não encontrado');

    const rawPosts = await postRepository.findByAuthor(username);
    const posts: PostDTO[] = await Promise.all(
      rawPosts.map(async (post) => {
        const book = await bookRepository.findByIsbn(post.bookIsbn);
        if (!book) throw new Error(`Livro ${post.bookIsbn} não encontrado`);

        const rawComments = await commentRepository.findByPost(post.id, 3);
        const comments: CommentDTO[] = await Promise.all(
          rawComments.map(async (c) => {
            const author = await userRepository.findByUsername(c.authorUsername);
            if (!author) throw new Error(`Autor do comentário não encontrado`);
            const commentLikes = await commentLikeRepository.findByComment(c.id, 3);
            const commentLikeUsers = await Promise.all(
              commentLikes.map((like) => userRepository.findByUsername(like.userUsername)),
            );
            return mapCommentToDTO(
              c,
              author,
              commentLikeUsers.filter((u): u is NonNullable<typeof u> => !!u),
            );
          }),
        );

        const postLikes = await postLikeRepository.findByPost(post.id, 10);
        const postLikeUsers = await Promise.all(
          postLikes.map((like) => userRepository.findByUsername(like.userUsername)),
        );

        return mapPostToDTO(
          post,
          user,
          book,
          postLikeUsers.filter((u): u is NonNullable<typeof u> => !!u),
          comments,
        );
      }),
    );

    const rawFollowers = await followRepository.findFollowers(username);
    const followers = await Promise.all(
      rawFollowers.map(async (f) => {
        const u = await userRepository.findByUsername(f.followerUsername);
        if (!u) throw new Error(`Seguidor ${f.followerUsername} não encontrado`);
        return mapUserToMinimalDTO(u);
      }),
    );

    const rawFollowing = await followRepository.findFollowing(username);
    const following = await Promise.all(
      rawFollowing.map(async (f) => {
        const u = await userRepository.findByUsername(f.followedUsername);
        if (!u) throw new Error(`Seguindo ${f.followedUsername} não encontrado`);
        return mapUserToMinimalDTO(u);
      }),
    );

    const rawEntries = await bookshelfRepository.findPublicByOwner(username);
    const bookshelfEntries: BookshelfEntryDTO[] = await Promise.all(
      rawEntries.map(async (entry) => {
        const book = await bookRepository.findByIsbn(entry.bookIsbn);
        if (!book) throw new Error(`Livro ${entry.bookIsbn} não encontrado`);
        return mapEntryToDTO(entry, book);
      }),
    );

    return {
      user: mapUserToDTO(user),
      posts,
      followers,
      following,
      bookshelfEntries,
    };
  }
}
