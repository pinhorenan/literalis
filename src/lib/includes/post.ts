// src/lib/includes/post.ts
import { Prisma } from '@prisma/client'
import { publicUserSelect } from './user'
import { publicBookSelect } from './book'
import { commentWithViewerInclude } from './comment'

// ---------- select base, tipado com PostDefaultArgs ----------
export const postSelectBase = Prisma.validator<Prisma.PostDefaultArgs>()({
  select: {
    id:        true,
    content:   true,
    progress:  true,
    createdAt: true,
    updatedAt: true,

    author: {
      select: {
        ...publicUserSelect,
        followers: {
          select: { followerUsername: true },
          orderBy: { createdAt: 'asc' },
        },
        _count: {
          select: { posts: true, bookshelf: true, followers: true, following: true },
        },
        following: { select: { followedUsername: true } },
      },
    },

    book: {
      select: {
        ...publicBookSelect,
        inShelves: { select: { userUsername: true } },
      },
    },

    _count: { select: { likes: true, comments: true } },
    likes:  { select: { userUsername: true } },

    comments: {
      orderBy: { createdAt: 'asc' },
      ...commentWithViewerInclude(),       // shape fixo
    },
  },
} as const)

// ---------- tipo derivado ----------
export type PostWithViewer = Prisma.PostGetPayload<typeof postSelectBase>

/**
 * Helper que inclui ou omite comments sem quebrar o tipo.
 */
export function postWithViewerInclude() {
  const sel = { ...postSelectBase.select }
  return { select: sel } satisfies { select: Prisma.PostSelect }
}
