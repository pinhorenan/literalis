// prisma/seed.ts
import { PrismaClient, NotificationType, ShelfStatus } from '@prisma/client';
import { faker } from '@faker-js/faker/locale/pt_BR';
import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';

const prisma = new PrismaClient();

// ─── Parâmetros de geração ─────────────────────────────────────────────────
const NUM_USERS = 45;
const NUM_BOOKS = 80;
const MAX_BOOKS_PER_SHELF = 55;
const MAX_FOLLOWS_PER_USER = 35;
const MAX_POSTS_PER_USER = 15;
const MAX_COMMENTS_PER_POST = 12;
const MAX_LIKES_PER_POST = 35;
const MAX_LIKES_PER_COMMENT = 25;

// ─── Diretórios de assets ───────────────────────────────────────────────────
const AVATAR_DIR = path.join(process.cwd(), 'public', 'uploads', 'avatars');
const COVER_DIR  = path.join(process.cwd(), 'public', 'uploads', 'covers');

async function main() {
  // ─── Cria pastas de upload ─────────────────────────────────────────────────
  await fs.mkdir(AVATAR_DIR, { recursive: true });
  await fs.mkdir(COVER_DIR,  { recursive: true });

  // ─── 1. Usuários ──────────────────────────────────────────────────────────
  const users = [];
  for (let i = 0; i < NUM_USERS; i++) {
    const name     = faker.person.fullName();
    const username = faker.internet.username().toLowerCase();
    const email    = `${username}@literalis.com`;
    const bio      = faker.lorem.paragraph();

    const user = await prisma.user.create({
      data: {
        username,
        name,
        email,
        password: faker.internet.password(),
        bio,
        avatarUrl: `/uploads/avatars/default.jpg`,
      },
    });
    users.push(user);
  }

  // ─── 2. Livros ────────────────────────────────────────────────────────────
  const books = [];
  for (let i = 0; i < NUM_BOOKS; i++) {
    const isbn            = faker.string.numeric(13);
    const title           = faker.lorem.words({ min: 2, max: 5 });
    const author          = faker.person.fullName();
    const publisher       = faker.company.name();
    const edition         = faker.number.int({ min: 1, max: 6 });
    const pages           = faker.number.int({ min: 80, max: 1500 });
    const publicationDate = faker.date.past({ years: 20 });
 
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
        coverUrl: `/uploads/covers/default.jpg`,
      },
    });
    books.push(book);
  }


  // 3. Criação de estantes
  for (const user of users) {
    const numBooks = faker.number.int({ min: 4, max: MAX_BOOKS_PER_SHELF });
    const shelfBooks = faker.helpers.shuffle(books).slice(0, numBooks);
    for (const book of shelfBooks) {
      await prisma.userBook.create({
        data: {
          userUsername: user.username,
          bookIsbn: book.isbn,
          progress: faker.number.int({ min: 0, max: book.pages ?? 1000 }),
          rating: faker.number.int({ min: 0, max: 10 }),
          status: faker.helpers.arrayElement(Object.values(ShelfStatus)),
        },
      });
    }
  }

  // 4. Criação de seguidores
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

  // 5. Criação de posts
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

      // 6. Criação de comentários
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
        // 7. Likes nos comentários
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

      // 8. Likes nos posts
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
        } catch {
          // ignora duplicatas
        }
      });
    }
  }
  
  console.log('Seed completed successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });