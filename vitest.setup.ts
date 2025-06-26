// vitest.setup.ts (na raiz do projeto)
import 'tsconfig-paths/register';
import { vi } from 'vitest';

vi.mock('@prisma/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@prisma/client')>();
  const mUser = {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };
  const mBook = {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };
  const mBookshelfEntry = {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    softDelete: vi.fn(),
    findPublicByOwner: vi.fn(),
    findAllByOwner: vi.fn(),
  };
  const mPost = {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };
  const mComment = {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };
  const mPostLike = {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };
  const mCommentLike = {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };
  const mFollow = {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };
  const mNotification = {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  const mPrismaClient = {
    user: mUser,
    book: mBook,
    bookshelfEntry: mBookshelfEntry,
    post: mPost,
    comment: mComment,
    postLike: mPostLike,
    commentLike: mCommentLike,
    follow: mFollow,
    notification: mNotification,
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    $transaction: vi.fn(),
  };

  return {
    ...actual,
    PrismaClient: vi.fn(() => mPrismaClient),
    ReadingStatus: {
      TO_READ: 'TO_READ',
      READING: 'READING',
      READ: 'READ',
      ABANDONED: 'ABANDONED',
    },
  };
});

vi.mock('bcryptjs', () => {
  const hash = vi.fn();
  const compare = vi.fn();
  return {
    default: { hash, compare },
    hash,
    compare,
  };
});

beforeAll(() => {});

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

afterAll(() => {});
