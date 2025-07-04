// src/types/next-auth.d.ts

import { Session, User } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: User & {
      id: string;
      username?: string | null;
      avatar?: string | null;
    };
  }

  interface User {
    id: string;
    username?: string | null;
    avatarUrl?: string | null;
  }
}
