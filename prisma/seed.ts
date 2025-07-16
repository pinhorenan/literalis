import { PrismaClient, ReadingStatus } from '@prisma/client' 
import { faker } from '@faker-js/faker/locale/pt_BR'
import fs from 'fs'
import path from 'path'

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

// Carrega o JSON relativo à pasta prisma/
const books: JsonBook[] = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, '../books.json'),
    'utf-8'
  )
)

const prisma = new PrismaClient()
const readingStatuses = Object.values(ReadingStatus) as ReadingStatus[];

async function main() {
  // 1) Publishers (upsert)
  const publisherNames = Array.from(new Set(books.map(b => b.publisher)))
  await Promise.all(
    publisherNames.map(name =>
      prisma.publisher.upsert({
        where: { name },
        create: { name },
        update: {},
      })
    )
  )
  const publisherMap = new Map(
    (await prisma.publisher.findMany({ select: { id: true, name: true } }))
      .map(p => [p.name, p.id])
  )

  // 2) Authors & Genres (upsert)
  const authorNames = Array.from(new Set(books.flatMap(b => b.authors)))
  const genreNames  = Array.from(new Set(books.flatMap(b => b.genres)))

  const authorMap = new Map<string,string>()
  const genreMap  = new Map<string,string>()

  await prisma.$transaction(async tx => {
    for (const name of authorNames) {
      const auth = await tx.author.upsert({
        where: { name },
        create: { name },
        update: {},
      })
      authorMap.set(name, auth.id)
    }
    for (const name of genreNames) {
      const gen = await tx.genre.upsert({
        where: { name },
        create: { name },
        update: {},
      })
      genreMap.set(name, gen.id)
    }
  })

  // 3) Books com relações muitos‑para‑muitos
  await prisma.$transaction(
    books.map(b =>
      prisma.book.upsert({
        where: { isbn: b.isbn13 },
        update: {},
        create: {
          isbn:           b.isbn13,
          title:          b.title,
          pages:          b.pages,
          language:       b.language,
          publicationDate: new Date(b.publicationYear, 0, 1),
          coverUrl:       b.coverUrl || '/uploads/covers/default.jpg',
          publisher:      { connect: { id: publisherMap.get(b.publisher)! } },
          authors: {
            create: b.authors.map(name => ({
              author: { connect: { id: authorMap.get(name)! } }
            }))
          },
          genres: {
            create: b.genres.map(name => ({
              genre: { connect: { id: genreMap.get(name)! } }
            }))
          },
        },
      })
    )
  )

  // 4) Users
  const usersData = Array.from({ length: 80 }, (_, i) => ({
    id:          faker.string.uuid(),
    username:    `${faker.internet.username().toLowerCase()}${i}`,
    name:        faker.person.fullName(),
    avatarUrl:   faker.image.avatar(),
    bio:         faker.lorem.sentence(),
    createdAt:   faker.date.past({ years: 2 }),
  }))
  await prisma.user.createMany({ data: usersData })
  const users = await prisma.user.findMany({ select: { id: true } })

  // 5) Bookshelves
  await prisma.bookshelfItem.deleteMany();

  for (const { id: userId } of users) {
    const count  = faker.number.int({ min: 10, max: 30 })
    const sample = faker.helpers.arrayElements(books, count)

    for (const b of sample) {
      const status = faker.helpers.arrayElement(readingStatuses);
      const currentPage = status === ReadingStatus.READ
        ? b.pages
        : faker.number.int({ min: 0, max: b.pages -1 });
      const rating = status === ReadingStatus.READ
        ? faker.number.int({ min: 1, max: 5 })
        : null;

    await prisma.bookshelfItem.upsert({
      where: { userId_bookIsbn: { userId, bookIsbn: b.isbn13 } },
      create: {
        userId,
        bookIsbn: b.isbn13,
        status,
        currentPage,
        rating,
        addedAt: faker.date.recent({ days: 700 })
      },
      update: {
        status,
        currentPage,
        rating,
        updatedAt: new Date(),
      },
    });
  }
}

  // 6) Posts
  const shelfItems = await prisma.bookshelfItem.findMany()
  const postsCreated = await Promise.all(
    books.map(async b => {
      const shelf = shelfItems.find(s => s.bookIsbn === b.isbn13)
      const authorId = shelf?.userId || faker.helpers.arrayElement(users).id
      return prisma.post.create({
        data: {
          authorId,
          bookIsbn:    b.isbn13,
          content:     faker.helpers.arrayElement(b.comments),
          progress:    shelf?.currentPage ?? 0,
          currentPage: shelf?.currentPage ?? 0,
          totalPages:  b.pages,
          rating:      faker.number.int({ min: 1, max: 5 }),
        },
      })
    })
  )

  // 7) Comments
  const commentsData: any[] = []
  for (const post of postsCreated) {
    const count = faker.number.int({ min: 0, max: 6 })
    const commenters = faker.helpers.arrayElements(users, count)
    for (const { id: authorId } of commenters) {
      if (authorId === post.authorId) continue
      commentsData.push({
        postId:    post.id,
        authorId,
        content:   faker.helpers.arrayElement([
          'Excelente reflexão!', 'Concordo totalmente.', 'Vou adicionar à minha lista.',
        ]),
        createdAt: faker.date.recent({ days: 365 }),
      })
    }
  }
  await prisma.comment.createMany({ data: commentsData })

  // 8) Likes
  const allComments = await prisma.comment.findMany({ select: { id: true, authorId: true } })
  const postLikes: any[] = []
  for (const post of postsCreated) {
    const likers = faker.helpers.arrayElements(users, faker.number.int({ min: 0, max: 30 }))
    for (const { id: userId } of likers) {
      if (userId !== post.authorId) postLikes.push({ userId, postId: post.id })
    }
  }
  await prisma.postLike.createMany({ data: postLikes })

  const commentLikes: any[] = []
  for (const com of allComments) {
    const likers = faker.helpers.arrayElements(users, faker.number.int({ min: 0, max: 15 }))
    for (const { id: userId } of likers) {
      if (userId !== com.authorId) commentLikes.push({ userId, commentId: com.id })
    }
  }
  await prisma.commentLike.createMany({ data: commentLikes })

  // 9) Follows
  const follows: any[] = []
  for (const { id: followerId } of users) {
    const following = faker.helpers.arrayElements(
      users.filter(u => u.id !== followerId),
      faker.number.int({ min: 5, max: 25 })
    )
    follows.push(...following.map(({ id: followedId }) => ({ followerId, followedId })))
  }
  await prisma.follow.createMany({ data: follows })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
