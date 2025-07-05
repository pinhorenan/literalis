// src/middleware.ts
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const user = req.auth?.user;
  const { pathname, origin } = req.nextUrl;

  if (!user && !pathname.startsWith('/api/auth')) {
    return NextResponse.redirect(new URL('/api/auth/signin', origin));
  }

  if (user && !user.username && pathname !== '/auth/onboarding') {
    return NextResponse.redirect(new URL('/auth/onboarding', origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api/auth|_next|.*\\..*).*)'],
};
