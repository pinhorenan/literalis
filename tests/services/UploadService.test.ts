// File: tests/UploadService.test.ts
import { UploadService } from '@/src/services/UploadService';

describe('UploadService', () => {
  const fakeFile = new File(['data'], 'pic.png', { type: 'image/png' });

  it('uploadAvatar envia FormData', async () => {
    (global.fetch as any).mockResolvedValue(
      global.__createFetchResponse({ url: '/img' }),
    );
    await UploadService.uploadAvatar(fakeFile);
    const [, opts] = (global.fetch as any).mock.calls[0];
    expect(opts.method).toBe('POST');
    expect(opts.body instanceof FormData).toBe(true);
  });

  it('uploadBookCover', async () => {
    (global.fetch as any).mockResolvedValue(
      global.__createFetchResponse({ url: '/cover' }),
    );
    const res = await UploadService.uploadBookCover(fakeFile);
    expect(res.url).toBe('/cover');
  });

  it('deleteAvatar', async () => {
    (global.fetch as any).mockResolvedValue(
      global.__createFetchResponse({ ok: true }),
    );
    const res = await UploadService.deleteAvatar();
    expect(res.ok).toBe(true);
  });
});
