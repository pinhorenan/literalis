// File: src/lib/repository/auth.ts
import { db } from '@lib/db';

export async function createUser(data: {
  username:   string;
  name:       string;
  email:      string;
  password:   string;
  avatarUrl?: string;
  bio?:       string;
}) {
  return db.user.create({ data });
}

export async function findUserWithPassword(username: string) {
  return db.user.findUnique({
    where: { username },
    select: {
      username: true,
      password: true,
    },
  });
}
