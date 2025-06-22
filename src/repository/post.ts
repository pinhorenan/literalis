import { db } from '@lib/db'
import { postWithViewerInclude, PostWithViewer } from '@/src/includes/post.include'

export async function findPostById(params: {
  id: string
}): Promise<PostWithViewer | null> {
  const { id } = params
  return db.post.findUnique({
    where: { id },
    ...postWithViewerInclude(),
  })
}
