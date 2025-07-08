// src/app/[username]/profile/client.tsx
'use client';

// import { useToast } from '@/components/ui/use-toast';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useFollowers, useFollowing, useBooksCount, useUserProfile } from '@/hooks/user';
import { useUserPosts } from '@/hooks/post';
