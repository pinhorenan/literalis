// src/app/profile/me/bookshelf/page.tsx
import { redirectToViewerProfile } from '@lib/auth/redirectToViewer';

export default async function MeBookshelf() {
  return redirectToViewerProfile('/bookshelf');
}
