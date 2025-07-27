// src/lib/constants/includes.ts

// Prisma includes commonly used across the application
export const MINIMAL_USER_INCLUDE = {
  id: true,
  username: true,
  name: true,
  avatarUrl: true,
} as const;

export const MINIMAL_BOOK_INCLUDE = {
  isbn: true,
  title: true,
  authors: {
    select: {
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  publisher: {
    select: {
      id: true,
      name: true,
    },
  },
  pages: true,
  language: true,
  coverUrl: true,
} as const;

export const MINIMAL_POST_INCLUDE = {
  id: true,
  content: true,
  createdAt: true,
  progress: true,
  currentPage: true,
  totalPages: true,
  rating: true,
  author: {
    select: MINIMAL_USER_INCLUDE,
  },
  book: {
    select: MINIMAL_BOOK_INCLUDE,
  },
  _count: {
    select: {
      likes: true,
      comments: true,
    },
  },
} as const;
