import { DefaultSession, DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      username: string;
      name: string;
      email: string;
      avatarUrl: string;
      bio?: string;
      image?: string;
    };
  }

  interface User {
    id: string;
    username: string;
    name: string;
    email: string;
    avatarUrl: string;
    bio?: string;
    image?: string;
  }
}