// src/lib/auth/redirectToViewer.ts
import { getViewerSession } from '@/src/services/viewer.service';
import { redirect } from 'next/navigation';

export async function redirectToViewerProfile(pathSuffix: string = '') {
    const session = await getViewerSession()

    if (!session?.user?.username) {
        redirect('/signin');
    }

    redirect(`/profile/${session.user.username}${pathSuffix}`);
}