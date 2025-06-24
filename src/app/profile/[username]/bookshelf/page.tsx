// File: src/app/profile/[username]/bookshelf/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions }      from '@/src/libs/authOptions'
import { db }               from '@lib/db'
import BookshelfClient      from '@components/client/bookshelf/BookshelfClient'

import type { UserDTO }     from '@/src/models/user.model'
import type { BookshelfEntryDTO } from '@/src/models/bookshelf.dto'

interface BookshelfPageProps {
  params: { username: string }
}

export default async function Bookshelf({ params }: BookshelfPageProps) {
  const { username } = await params

  // 1) Puxa dados básicos do user
  const profileUser = await db.user.findUnique({
    where: { username },
    select: { username: true, name: true, avatarUrl: true, bio: true }
  })
  if (!profileUser) return null
  const userDTO = profileUser as UserDTO

  // 2) Sessão e ownership
  const session = await getServerSession(authOptions)
  const me = session?.user?.username
  const isOwner = me === username

  // 3) Puxa estante
  const shelfEntries = await db.userBook.findMany({
    where: { userUsername: username },
    include: {
      book: {
        select: {
          isbn:            true,
          title:           true,
          author:          true,
          pages:           true,
          publisher:       true,
          edition:         true,
          language:        true,
          publicationDate: true,
          coverUrl:        true,
        }
      }
    },
    orderBy: { addedAt: 'desc' }
  })

  // 4) Mapeia para UserBookDTO…
  const initialItems: BookshelfEntryDTO[] = shelfEntries.map((e) => ({
    user: userDTO,
    book: {
      isbn:             e.book.isbn,
      title:            e.book.title,
      author:           e.book.author,
      coverUrl:         e.book.coverUrl,
      publisher:        e.book.publisher ?? undefined,
      edition:          e.book.edition   ?? undefined,
      pages:            e.book.pages     ?? undefined,
      language:         e.book.language  ?? undefined,
      publicationDate:  e.book.publicationDate
                          ? e.book.publicationDate.toISOString()
                          : undefined,
      external:         undefined, // ou `false` se quiser
    },
    progressPages: e.progress,
    progressPct:   e.book.pages
                      ? Math.min(100, Math.round((e.progress / e.book.pages) * 100))
                      : null,
    addedAt:  e.addedAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
    status:    e.status,
    isPrivate: e.isPrivate,
  }))

  return (
    <section className="py-6 space-y-6">
      <BookshelfClient
        initialItems={initialItems}
        username={username}
        isOwner={isOwner}
      />
    </section>
  )
}
