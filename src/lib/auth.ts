// File: src/server/auth.ts
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },

  providers: [
    CredentialsProvider({
      name: 'Credenciais',
      credentials: {
        username: { label: 'Usuário', type: 'text' },
        password: { label: 'Senha',   type: 'password' },
      },
      // Note a assinatura (credentials, req)
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials.password) return null;

        const username = credentials.username.trim().toLowerCase();
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        // Deve retornar um objeto compatível com o tipo User do NextAuth
        return {
          id:         user.username,
          name:       user.name,
          email:      user.email || '',
          image:      user.avatarUrl,    // NextAuth espera "image"
          avatarUrl:  user.avatarUrl,    // nosso campo extra
          bio:        user.bio || '',    // nosso campo extra
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

      // Recarrega o usuário do banco só com campos públicos
      const dbUser = await prisma.user.findUnique({
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
