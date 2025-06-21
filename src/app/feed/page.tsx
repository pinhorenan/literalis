// File: src/app/feed/page.tsx
import FeedClient from '@components/client/feed/FeedClient';
import { prisma } from '@lib/prisma';
import { getViewer, feedPostInclude } from '@lib/api';
import type { PostDTO } from '@dto/post.dto';

export default async function PageFeed() {
  // Obtém usuário autenticado, se houver
  const viewer = await getViewer(false);
  const viewerUsername = viewer?.username ?? null;

  // Busca posts já com todas as propriedades necessárias para PostDTO
  const posts = await prisma.post.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: feedPostInclude(viewerUsername),
  });

  // Converte diretamente para PostDTO[] (já contém tudo que FeedClient precisa)
  const initialPosts = posts as unknown as PostDTO[];

  return (
    <FeedClient
      initialPosts={initialPosts}
      initialTab="discover"
    />
  );
}
