// src/services/viewer.service.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@lib/auth/authOptions';

export async function getViewerSession() {
    return await getServerSession(authOptions);
}