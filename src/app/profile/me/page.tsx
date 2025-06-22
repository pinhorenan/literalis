// src/app/profile/me/page.tsx
import { redirectToViewerProfile } from '@lib/auth/redirectToViewer';

export default async function Me() {
  return redirectToViewerProfile();
}
