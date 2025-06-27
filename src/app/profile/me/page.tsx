// src/app/profile/me/page.tsx
import { redirectToViewerProfile } from '@libs/auth/redirectToViewer';

export default async function Me() {
  return redirectToViewerProfile();
}
