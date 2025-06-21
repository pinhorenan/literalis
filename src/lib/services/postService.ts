import type { PostDTO } from '@models/post.dto'
import { findPostById } from '@repository/post'
import { mapCommentToDTO } from '@/src/lib/services/commentService'
import { mapUserToDTO } from '@/src/lib/services/userService'

export async function getPost(
  id: string,
  viewerUsername?: string | null,
): Promise<PostDTO | null> {
  const p = await findPostById({ id })
  if (!p) return null

  const authorDTO = mapUserToDTO(p.author, viewerUsername ?? null)

  return {
    id:        p.id,
    content:   p.content,
    progress:  p.progress,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),

    likeCount:    p._count.likes,
    commentCount: p._count.comments,
    likedByMe:    Boolean(viewerUsername && p.likes.some(l => l.userUsername === viewerUsername)),

    // Agora não precisamos acessar followers diretamente
    isFollowingAuthor: authorDTO.isFollowing,

    // Basta verificar se existe UserBook para o viewer
    isInMyBookshelf: viewerUsername
      ? p.book.inShelves.some(s => s.userUsername === viewerUsername)
      : false,

    author: authorDTO,

    book: {
      isbn:            p.book.isbn,
      title:           p.book.title,
      author:          p.book.author,
      coverUrl:        p.book.coverUrl,
      publisher:       p.book.publisher ?? undefined,
      edition:         p.book.edition   ?? undefined,
      pages:           p.book.pages     ?? undefined,
      language:        p.book.language  ?? undefined,
      publicationDate: p.book.publicationDate
        ? p.book.publicationDate.toISOString()
        : undefined,
      external:        p.book.externalSource !== 'INTERNAL',
    },

    likedBy: [], // implementar depois se precisar
    comments: p.comments.map(c => mapCommentToDTO(c, viewerUsername ?? null)),
  }
}
