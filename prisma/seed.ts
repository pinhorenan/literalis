// prisma/seed.ts
import { PrismaClient, NotificationType, ShelfStatus } from '@prisma/client';
import { faker } from '@faker-js/faker/locale/pt_BR';
import fs from 'fs/promises';
import { createWriteStream } from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

const NUM_USERS = 45;
const NUM_BOOKS = 80;
const MAX_BOOKS_PER_SHELF = 55;
const MAX_FOLLOWS_PER_USER = 35;
const MAX_POSTS_PER_USER = 15;
const MAX_COMMENTS_PER_POST = 12;
const MAX_LIKES_PER_POST = 35;
const MAX_LIKES_PER_COMMENT = 25;

const AVATAR_DIR = path.join(process.cwd(), 'public', 'uploads', 'avatars');
const COVER_DIR = path.join(process.cwd(), 'public', 'uploads', 'covers');

async function downloadImageToUploads(url: string, destPath: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erro ao baixar imagem: ${url}`);
  await pipeline(res.body as any, createWriteStream(destPath));
}

async function main() {
  await fs.mkdir(AVATAR_DIR, { recursive: true });
  await fs.mkdir(COVER_DIR, { recursive: true });

  const users = [];
  for (let i = 0; i < NUM_USERS; i++) {
    const name = faker.person.fullName();
    const username = faker.internet.username().toLowerCase();
    const email = `${username}@literalis.com`;
    const bio = faker.lorem.paragraph();
    const avatarUrl = faker.image.avatar();
    const avatarPath = path.join(AVATAR_DIR, `${username}.jpg`);

    try {
      await downloadImageToUploads(avatarUrl, avatarPath);
    } catch {
      console.warn(`Falha ao baixar avatar de ${username}`);
    }

    const user = await prisma.user.create({
      data: {
        username,
        name,
        email,
        password: faker.internet.password(),
        bio,
        avatarUrl: `/uploads/avatars/${username}.jpg`,
      },
    });
    users.push(user);
  }

  const books = [];
  for (let i = 0; i < NUM_BOOKS; i++) {
    const isbn = faker.string.numeric(13);
    const title = faker.lorem.words({ min: 2, max: 5 });
    const author = faker.person.fullName();
    const publisher = faker.company.name();
    const edition = faker.number.int({ min: 1, max: 6 });
    const pages = faker.number.int({ min: 80, max: 1500 });
    const publicationDate = faker.date.past({ years: 20 });
    const coverUrl = faker.image.urlPicsumPhotos({ width: 400, height: 600 });
    const coverPath = path.join(COVER_DIR, `${isbn}.jpg`);

    try {
      await downloadImageToUploads(coverUrl, coverPath);
    } catch {
      console.warn(`Falha ao baixar capa de ${isbn}`);
    }

    const book = await prisma.book.create({
      data: {
        isbn,
        title,
        author,
        publisher,
        edition,
        pages,
        language: 'Português',
        publicationDate,
        coverUrl: `/uploads/covers/${isbn}.jpg`,
      },
    });
    books.push(book);
  }

  for (const user of users) {
    const numBooks = faker.number.int({ min: 4, max: MAX_BOOKS_PER_SHELF });
    const shelfBooks = faker.helpers.shuffle(books).slice(0, numBooks);
    for (const book of shelfBooks) {
      await prisma.userBook.create({
        data: {
          userUsername: user.username,
          bookIsbn: book.isbn,
          currentPage: faker.number.int({ min: 0, max: book.pages ?? 1000 }),
          rating: faker.number.int({ min: 0, max: 10 }),
          status: faker.helpers.arrayElement(Object.values(ShelfStatus)),
        },
      });
    }
  }

  for (const follower of users) {
    const possible = users.filter(u => u.username !== follower.username);
    const toFollow = faker.helpers.shuffle(possible).slice(0, MAX_FOLLOWS_PER_USER);
    for (const followed of toFollow) {
      await prisma.follow.create({
        data: {
          followerUsername: follower.username,
          followedUsername: followed.username,
        },
      });
      await prisma.notification.create({
        data: {
          notifType: NotificationType.FOLLOW,
          actorUsername: follower.username,
          recipientUsername: followed.username,
        },
      });
    }
  }

  for (const author of users) {
    const numPosts = faker.number.int({ min: 1, max: MAX_POSTS_PER_USER });
    for (let p = 0; p < numPosts; p++) {
      const book = faker.helpers.arrayElement(books);
      const post = await prisma.post.create({
        data: {
          authorUsername: author.username,
          bookIsbn: book.isbn,
          content: faker.lorem.paragraphs({ min: 1, max: 3 }),
          progress: faker.number.int({ min: 0, max: book.pages ?? 100 }),
        },
      });

      const numComments = faker.number.int({ min: 0, max: MAX_COMMENTS_PER_POST });
      const commentUsers = faker.helpers.shuffle(users).slice(0, numComments);
      for (const commenter of commentUsers) {
        const comment = await prisma.comment.create({
          data: {
            postId: post.id,
            authorUsername: commenter.username,
            content: faker.lorem.sentence(),
          },
        });
        await prisma.notification.create({
          data: {
            notifType: NotificationType.COMMENT,
            actorUsername: commenter.username,
            recipientUsername: author.username,
            postId: post.id,
            commentId: comment.id,
          },
        });

        const numCLikes = faker.number.int({ min: 0, max: MAX_LIKES_PER_COMMENT });
        faker.helpers.shuffle(users).slice(0, numCLikes).forEach(async liker => {
          await prisma.commentLike.create({
            data: {
              userUsername: liker.username,
              commentId: comment.id,
            },
          });
        });
      }

      const numLikes = faker.number.int({ min: 0, max: MAX_LIKES_PER_POST });
      faker.helpers.shuffle(users).slice(0, numLikes).forEach(async liker => {
        try {
          await prisma.postLike.create({
            data: {
              userUsername: liker.username,
              postId: post.id,
            },
          });
          await prisma.notification.create({
            data: {
              notifType: NotificationType.LIKE,
              actorUsername: liker.username,
              recipientUsername: author.username,
              postId: post.id,
            },
          });
        } catch {}
      });
    }
  }

  console.log('Seed concluído com sucesso!');
}

main()
  .catch(e => {
    console.error('Erro ao executar o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
