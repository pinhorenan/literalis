// File: src/components/server/user/UserSuggestions.tsx
import { getServerSession }   from 'next-auth/next';
import { authOptions }        from '@/src/lib/auth';
import { prisma }             from '@/src/lib/prisma';
import UserSummary            from '@components/server/user/UserSummary';
import FollowButton           from '@components/client/ui/FollowButton';
import type { UserDTO }       from '@dto/user.dto';

export default async function UserSuggestions() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const me = session.user.username;
  const suggestedUsers = (await prisma.user.findMany({
    where: {
      username: { not: me },
      following: { none: { followerUsername: me } },
    },
    select: { username: true, name: true, avatarUrl: true },
    take: 10,
    orderBy: { username: 'asc' },
  })) as UserDTO[];

  if (suggestedUsers.length === 0) return null;

  return (
    <section>
      <h3 className="mb-3 text-base font-semibold text-[var(--text-primary)]">
        Sugestões para você
      </h3>
      <ul className="flex flex-col gap-4">
        {suggestedUsers.map(user => (
          <li key={user.username} className="flex gap-3 items-center justify-between">
            <UserSummary user={user} size="md" redirect />
            <FollowButton targetUsername={user.username} />
          </li>
        ))}
      </ul>
    </section>
  );
}
