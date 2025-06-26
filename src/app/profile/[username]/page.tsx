// src/app/profile/[username]/page.tsx
import { notFound } from 'next/navigation';
import { UserDTO } from '@models/user.model';
import { PostDTO } from '@models/post.model';
import { getUserByUsername } from '@clients/user.client';
import ProfileShell from '@components/client/profile/ProfileShell';

export default async function Profile({ params }: { params: { username: string } }) {
  const { username } = params;
  const user: UserDTO = await getUserByUsername(username);
  if (!user) {
    // Se o usuário não for encontrado, retorna uma página 404
    return notFound();
  }
  const posts: PostDTO[] = []; // TODO

  return <ProfileShell initialUser={user} initialPosts={posts} />;
}
