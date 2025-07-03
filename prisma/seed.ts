import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker/locale/pt_BR';
import fs from 'fs';
import path from 'path';

// Tipagem dos dados de livros
interface JsonBook {
  title: string;
  isbn13: string;
  authors: string[];
  pages: number;
  language: string;
  publicationYear: number;
  publisher: string;
  coverUrl: string;
  genres: string[];
  comments: string[];
}

// Carrega o JSON de livros
const books: JsonBook[] = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'books.json'), 'utf-8'),
);

const prisma = new PrismaClient();

// 1) Publishers
async function seedPublishers() {
  const names = Array.from(new Set(books.map((b) => b.publisher)));
  await Promise.all(
    names.map((name) =>
      prisma.publisher.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );
  const all = await prisma.publisher.findMany({ select: { id: true, name: true } });
  return new Map(all.map((p) => [p.name, p.id]));
}

// 2) Authors e Genres
async function seedAuthors() {
  const names = Array.from(new Set(books.flatMap((b) => b.authors)));
  const map = new Map<string, string>();
  for (const name of names) {
    let auth = await prisma.author.findUnique({ where: { name } });
    if (!auth) auth = await prisma.author.create({ data: { name } });
    map.set(name, auth.id);
  }
  return map;
}
async function seedGenres() {
  const names = Array.from(new Set(books.flatMap((b) => b.genres)));
  const map = new Map<string, string>();
  for (const name of names) {
    let gen = await prisma.genre.findUnique({ where: { name } });
    if (!gen) gen = await prisma.genre.create({ data: { name } });
    map.set(name, gen.id);
  }
  return map;
}

// 3) Books
async function seedBooks(
  publisherMap: Map<string, string>,
  authorMap: Map<string, string>,
  genreMap: Map<string, string>,
) {
  await Promise.all(
    books.map((b) =>
      prisma.book.upsert({
        where: { isbn: b.isbn13 },
        update: {},
        create: {
          isbn: b.isbn13,
          title: b.title,
          pages: b.pages,
          language: b.language,
          publicationDate: new Date(b.publicationYear, 0, 1),
          coverUrl: b.coverUrl || '/uploads/covers/default.jpg',
          publisher: { connect: { id: publisherMap.get(b.publisher)! } },
          authors: {
            create: b.authors.map((name) => ({
              author: { connect: { id: authorMap.get(name)! } },
            })),
          },
          genres: {
            create: b.genres.map((g) => ({
              genre: { connect: { id: genreMap.get(g)! } },
            })),
          },
        },
      }),
    ),
  );
}

// 4) Users
async function seedUsers() {
  const usersData = Array.from({ length: 80 }, (_, i) => ({
    id: faker.string.uuid(),
    username: `${faker.internet.userName().toLowerCase()}${i}`,
    name: faker.person.fullName(),
    avatarUrl: faker.image.avatar(),
    bio: faker.lorem.sentence(),
    createdAt: faker.date.past({ years: 2 }),
  }));
  await prisma.user.createMany({ data: usersData, skipDuplicates: true });
  return prisma.user.findMany({ select: { id: true } });
}

// 5) Bookshelves
async function seedBookshelves(users: { id: string }[]) {
  for (const user of users) {
    const count = faker.number.int({ min: 10, max: 30 });
    const sample = faker.helpers.arrayElements(books, count);
    await prisma.bookshelfItem.createMany({
      data: sample.map((b) => {
        const status = faker.helpers.arrayElement([
          'TO_READ',
          'WISHLISTED',
          'READING',
          'PAUSED',
          'READ',
          'ABANDONED',
        ]) as any;
        const currentPage =
          status === 'READ' ? b.pages : faker.number.int({ min: 0, max: b.pages - 1 });
        return {
          userId: user.id,
          bookIsbn: b.isbn13,
          status,
          currentPage,
          rating: status === 'READ' ? faker.number.int({ min: 1, max: 5 }) : null,
          addedAt: faker.date.recent({ days: 700 }),
        };
      }),
      skipDuplicates: true,
    });
  }
}

// 6) Posts
async function seedPosts(users: { id: string }[]) {
  const influencers = faker.helpers.arrayElements(users, Math.ceil(users.length * 0.05));
  const posts: Array<{ id: string; authorId: string }> = [];

  // 1 post por livro
  for (const b of books) {
    const shelf = await prisma.bookshelfItem.findFirst({ where: { bookIsbn: b.isbn13 } });
    const authorId = shelf?.userId ?? faker.helpers.arrayElement(users).id;
    await prisma.post.create({
      data: {
        authorId,
        bookIsbn: b.isbn13,
        content: faker.helpers.arrayElement(b.comments),
        progress: shelf?.currentPage ?? 0,
        currentPage: shelf?.currentPage ?? 0,
        totalPages: b.pages,
        rating: faker.number.int({ min: 1, max: 5 }),
      },
    });
  }

  // Posts extras influenciadores
  for (const inf of influencers) {
    const shelves = await prisma.bookshelfItem.findMany({ where: { userId: inf.id } });
    const extras = faker.helpers.arrayElements(shelves, faker.number.int({ min: 10, max: 20 }));
    for (const s of extras) {
      const book = books.find((bk) => bk.isbn13 === s.bookIsbn)!;
      posts.push({ id: '', authorId: inf.id });
      await prisma.post.create({
        data: {
          authorId: inf.id,
          bookIsbn: s.bookIsbn,
          content: faker.helpers.arrayElement(book.comments),
          progress: s.status === 'READ' ? 100 : Math.round((s.currentPage / book.pages) * 100),
          currentPage: s.currentPage,
          totalPages: book.pages,
          rating: s.rating,
        },
      });
    }
  }

  return prisma.post.findMany({ select: { id: true, authorId: true } });
}

// 7) Comments
async function seedComments(
  posts: Array<{ id: string; authorId: string }>,
  users: { id: string }[],
) {
  const generic = [
    'Excelente reflexão!',
    'Concordo totalmente.',
    'Vou adicionar à minha lista.',
    'Ótimo ponto de vista!',
    'Adorei sua análise!',
    'Esse trecho me marcou.',
    'Boa resenha! 👏',
    'Preciso reler.',
    'Obrigado pela dica!',
    'Leitura obrigatória!',
  ];
  const data: any[] = [];
  for (const post of posts) {
    const count = faker.number.int({ min: 0, max: 6 });
    const commentUsers = faker.helpers.arrayElements(users, count);
    for (const u of commentUsers) {
      if (u.id === post.authorId) continue;
      data.push({
        postId: post.id,
        authorId: u.id,
        content: faker.helpers.arrayElement(generic),
        createdAt: faker.date.recent({ days: 365 }),
      });
    }
  }
  await prisma.comment.createMany({ data, skipDuplicates: true });
}

// 8) Likes
async function seedLikes(
  posts: Array<{ id: string; authorId: string }>,
  comments: Array<{ id: string; authorId: string }>,
  users: { id: string }[],
) {
  const postLikes: any[] = [];
  for (const post of posts) {
    const likers = faker.helpers.arrayElements(users, faker.number.int({ min: 0, max: 30 }));
    for (const u of likers) {
      if (u.id === post.authorId) continue;
      postLikes.push({ userId: u.id, postId: post.id });
    }
  }
  await prisma.postLike.createMany({ data: postLikes, skipDuplicates: true });

  const commentLikes: any[] = [];
  for (const com of comments) {
    const likers = faker.helpers.arrayElements(users, faker.number.int({ min: 0, max: 15 }));
    for (const u of likers) {
      if (u.id === com.authorId) continue;
      commentLikes.push({ userId: u.id, commentId: com.id });
    }
  }
  await prisma.commentLike.createMany({ data: commentLikes, skipDuplicates: true });
}

// 9) Follows
async function seedFollows(users: { id: string }[]) {
  const data: any[] = [];
  for (const user of users) {
    const following = faker.helpers.arrayElements(
      users.filter((u) => u.id !== user.id),
      faker.number.int({ min: 5, max: 25 }),
    );
    for (const f of following) data.push({ followerId: user.id, followedId: f.id });
  }
  await prisma.follow.createMany({ data, skipDuplicates: true });
}

// Fluxo principal
async function main() {
  const publisherMap = await seedPublishers();
  const authorMap = await seedAuthors();
  const genreMap = await seedGenres();
  await seedBooks(publisherMap, authorMap, genreMap);
  await seedBookshelves(await seedUsers());
  const posts = await seedPosts(await prisma.user.findMany({ select: { id: true } }));
  const comments = await prisma.comment.findMany({ select: { id: true, authorId: true } });
  await seedComments(posts, await prisma.user.findMany({ select: { id: true } }));
  await seedLikes(posts, comments, await prisma.user.findMany({ select: { id: true } }));
  await seedFollows(await prisma.user.findMany({ select: { id: true } }));
  console.log('✨ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
