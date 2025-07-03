import GitHubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/src/lib/prisma';
import type { NextAuthOptions } from 'next-auth';

export const options: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,

      profile(profile) {
        return {
          id: profile.id,
          name: profile.name ?? profile.login,
          avatarUrl: profile.avatar_url,
        };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    /**
     * 1️⃣ After every sign-in we check if profile is complete.
     * Returning a string here turns the sign-in into a redirect.
     */
    async signIn({ user }) {
      if (!user.username) return '/onboarding';
      return true; // continue normally
    },

    /**
     * 2️⃣ Expose extra fields to the client session object.
     */
    async session({ session, token, user }) {
      session.user.id = user.id;
      session.user.username = user.username;
      session.user.avatar = user.avatarUrl;
      return session;
    },

    /**
     * 3️⃣ Persist `username` inside the JWT so middleware
     *     can decide quickly without DB round-trip.
     */
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username ?? null;
      }
      return token;
    },
  },
  /**
   * 4️⃣ Keep profile in sync whenever a provider is (re)linked.
   */
  events: {
    async linkAccount({ user, profile }) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          avatarUrl: profile.avatarUrl ?? user.avatarUrl,
          name: profile.name ?? user.name,
        },
      });
    },
  },
};
