import { PrismaClient, NotificationType, ShelfStatus } from '@prisma/client';
import { faker } from '@faker-js/faker/locale/pt_BR';
import fs from 'fs/promises';
import { createWriteStream } from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/* ── CONFIGURAÇÕES ─────────────────────────────────────────────────────── */
const NUM_USERS = 45;
const NUM_BOOKS = 80;
const MAX_BOOKS_PER_SHELF = 55;
const MAX_FOLLOWS_PER_USER = 35;
const MAX_POSTS_PER_USER = 15;
const MAX_COMMENTS_PER_POST = 12;
const MAX_LIKES_PER_POST = 35;
const MAX_LIKES_PER_COMMENT = 25;

const AVATAR_DIR = path.join(process.cwd(), 'public', 'uploads', 'avatars');
const COVER_DIR  = path.join(process.cwd(), 'public', 'uploads', 'covers');

async function downloadImage(url: string, dest: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Falha ao baixar imagem: ${url}`);
  await pipeline(res.body as any, createWriteStream(dest));
}

async function main() {
  await fs.mkdir(AVATAR_DIR, { recursive: true });
  await fs.mkdir(COVER_DIR,  { recursive: true });

  const users: string[] = [];

  // 1. Usuários + Accounts (credentials provider)
  for (let i = 0; i < NUM_USERS; i++) {
    const username = faker.internet.username().toLowerCase();
    const avatarPath = path.join(AVATAR_DIR, `${username}.jpg`);

    try {
      await downloadImage(faker.image.avatar(), avatarPath);
    } catch {
      console.warn(`Falha ao baixar avatar de ${username}`);
    }

    const user = await prisma.user.create({
      data: {
        username,
        name: faker.person.fullName(),
        email: `${username}@literalis.com`,
        bio: faker.lorem.paragraph(),
        avatarUrl: `/uploads/avatars/${username}.jpg`,
      },
    });

    // Gera e armazena senha para NextAuth Credentials
    const rawPassword = faker.internet.password();
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    await prisma.account.create({
      data: {
        userUsername: user.username,
        provider: 'credentials',
        providerAccountId: user.username,
        passwordHash,
      },
    });

    users.push(user.username);
  }

  // 2. Livros
  const books = [];
  for (let i = 0; i < NUM_BOOKS; i++) {
    const isbn = faker.string.numeric(13);
    const coverPath = path.join(COVER_DIR, `${isbn}.jpg`);

    try {
      await downloadImage(
        faker.image.urlPicsumPhotos({ width: 400, height: 600 }),
        coverPath
      );
    } catch {
      console.warn(`Falha ao baixar capa de ${isbn}`);
    }

    books.push(
      await prisma.book.create({
        data: {
          isbn,
          title: faker.lorem.words({ min: 2, max: 5 }),
          author: faker.person.fullName(),
          publisher: faker.company.name(),
          edition: faker.number.int({ min: 1, max: 6 }),
          pages: faker.number.int({ min: 80, max: 1500 }),
          language: 'Português',
          publicationDate: faker.date.past({ years: 20 }),
          coverUrl: `/uploads/covers/${isbn}.jpg`,
        },
      })
    );
  }

  // 3. Estantes (UserBook)
  const shelfIndex: Record<string, string[]> = {};
  for (const username of users) {
    const shelfBooks = faker.helpers
      .shuffle(books)
      .slice(0, faker.number.int({ min: 4, max: MAX_BOOKS_PER_SHELF }));

    shelfIndex[username] = [];

    for (const book of shelfBooks) {
      shelfIndex[username].push(book.isbn);
      await prisma.userBook.create({
        data: {
          userUsername: username,
          bookIsbn: book.isbn,
          currentPage: faker.number.int({ min: 0, max: book.pages ?? 1000 }),
          rating: faker.number.int({ min: 0, max: 10 }),
          status: faker.helpers.arrayElement(Object.values(ShelfStatus)),
        },
      });
    }
  }

  // 4. Follows + Notifications de Follow
  for (const follower of users) {
    const toFollow = faker.helpers
      .shuffle(users.filter(u => u !== follower))
      .slice(0, MAX_FOLLOWS_PER_USER);

    for (const followed of toFollow) {
      await prisma.follow.create({ data: { followerUsername: follower, followedUsername: followed } });
      await prisma.notification.create({ data: {
        notifType: NotificationType.FOLLOW,
        actorUsername: follower,
        recipientUsername: followed,
      }});
    }
  }

  // 5. Posts, Comments, Likes e Notifications
  for (const author of users) {
    const numPosts = faker.number.int({ min: 1, max: MAX_POSTS_PER_USER });

    for (let p = 0; p < numPosts; p++) {
      const candidateList = shelfIndex[author] ?? [];
      let bookIsbn = faker.helpers.arrayElement(candidateList.length ? candidateList : books.map(b => b.isbn));

      const userBook = await prisma.userBook.findUnique({
        where: { userUsername_bookIsbn: { userUsername: author, bookIsbn } },
      });

      const post = await prisma.post.create({ data: {
        userUsername: author,
        bookIsbn,
        content: faker.lorem.paragraphs({ min: 1, max: 3 }),
        progress: userBook?.currentPage ?? 0,
      }});

      // Comentários
      const commenters = faker.helpers.shuffle(users).slice(0, faker.number.int({ min: 0, max: MAX_COMMENTS_PER_POST }));
      for (const commenter of commenters) {
        const comment = await prisma.comment.create({ data: {
          postId: post.id,
          authorUsername: commenter,
          content: faker.lorem.sentence(),
        }});
        await prisma.notification.create({ data: {
          notifType: NotificationType.COMMENT,
          actorUsername: commenter,
          recipientUsername: author,
          postId: post.id,
          commentId: comment.id,
        }});
        const cLikers = faker.helpers.shuffle(users).slice(0, faker.number.int({ min: 0, max: MAX_LIKES_PER_COMMENT }));
        await Promise.all(cLikers.map(liker => prisma.commentLike.create({ data: {
          userUsername: liker,
          commentId: comment.id,
        }})));
      }

      // Likes de post
      const likers = faker.helpers.shuffle(users).slice(0, faker.number.int({ min: 0, max: MAX_LIKES_PER_POST }));
      await Promise.all(likers.map(liker => prisma.postLike.create({ data: {
        userUsername: liker,
        postId: post.id,
      }})));
      await Promise.all(likers.map(liker => prisma.notification.create({ data: {
        notifType: NotificationType.LIKE,
        actorUsername: liker,
        recipientUsername: author,
        postId: post.id,
      }})));
    }
  }

  console.log('Seed concluído com sucesso!');
}

main()
  .catch(e => {
    console.error('Erro ao executar o seed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
