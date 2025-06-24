import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { db } from '@libs/db';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },

  providers: [
    CredentialsProvider({
      name: 'Credenciais',
      credentials: {
        username: { label: 'Usuário', type: 'text' },
        password: { label: 'Senha',   type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials.password) return null;

        const username = credentials.username.trim().toLowerCase();
        const user = await db.user.findUnique({ where: { username } });
        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id:         user.username,
          name:       user.name,
          email:      user.email || '',
          image:      user.avatarUrl,
          avatarUrl:  user.avatarUrl,
          bio:        user.bio || '',
        } as any;
      },
    }),
  ],

  pages: {
    signIn: '/signIn',
    error:  '/signIn',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = (user as any).id;
      }
      return token;
    },

    async session({ session, token }) {
      if (!token.username) return session;

      const dbUser = await db.user.findUnique({
        where: { username: token.username as string },
        select: {
          username:  true,
          name:      true,
          email:     true,
          avatarUrl: true,
          bio:       true,
        },
      });

      if (dbUser) {
        session.user = {
          id:        dbUser.username,
          username:  dbUser.username,
          name:      dbUser.name,
          email:     dbUser.email || '',
          avatarUrl: dbUser.avatarUrl,
          bio:       dbUser.bio || '',
          image:     dbUser.avatarUrl,
        };
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
