// src/lib/auth.ts
import NextAuth, { type NextAuthConfig } from 'next-auth';
import GitHubProvider, { type GitHubProfile } from 'next-auth/providers/github';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      profile(p: GitHubProfile) {
        return {
          id: p.id.toString(),
          name: p.name ?? p.login,
          email: p.email ?? null,
          avatarUrl: p.avatar_url,
        };
      },
    }),
  ],
  session: { strategy: 'jwt' },

  callbacks: {
    async signIn() {
      return true;
    },
    async session({ session, token }) {
      session.user.id = token.sub as string;
      session.user.username = token.username as string | null;
      session.user.avatarUrl = token.avatar as string | null;
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.username = user.username ?? null;
        token.avatar = (user as any).avatarUrl ?? null;
      }
      if (trigger === 'update' && session?.user?.username) token.username = session.user.username;
      return token;
    },
  },
  events: {
    async linkAccount({ user, profile }) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          ...(profile.name && { name: profile.name }),
          ...(profile.avatarUrl && { avatarUrl: profile.avatarUrl }),
        },
      });
    },
  },
};

export const { handlers, auth, unstable_update } = NextAuth(authConfig);
