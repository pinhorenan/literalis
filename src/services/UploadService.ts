// File: src/services/UploadService.ts
import { httpClient } from '@services/HTTPClient';

/** Generic file uploader returning `{ url }` on success. */
async function upload(path: string, file: File): Promise<{ url: string }> {
  const form = new FormData();
  form.append('file', file);
  return httpClient.post<{ url: string }>(path, undefined, { body: form });
}

export const UploadService = {
  uploadAvatar: (file: File) => upload('/api/upload/avatar', file),
  uploadBookCover: (file: File) => upload('/api/upload/book-cover', file),
  deleteAvatar: () => httpClient.del<{ ok: boolean }>('/api/upload/avatar'),
};
