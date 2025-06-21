// File: tests/ProfileService.test.ts
import { ProfileService } from '@/src/services/ProfileService';

describe('ProfileService', () => {
  it('get perfil', async () => {
    (global.fetch as any).mockResolvedValue(
      global.__createFetchResponse({ username: 'alice' }),
    );
    const user = await ProfileService.get('alice');
    expect(user.username).toBe('alice');
  });

  it('update perfil', async () => {
    (global.fetch as any).mockResolvedValue(
      global.__createFetchResponse({ username: 'alice', bio: 'hi' }),
    );
    const res = await ProfileService.update('alice', { bio: 'hi' });
    expect(res.bio).toBe('hi');
  });
});
