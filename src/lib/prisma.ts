import { PrismaClient } from '@prisma/client';

// Ensure that the Prisma Client is only instantiated once in development mode
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.prisma ||
  new PrismaClient({
    log: ['info', 'warn', 'error'],
  });
