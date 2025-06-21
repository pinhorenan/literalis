// File: tests/AuthService.test.ts
import { AuthService } from '@/src/lib/services/AuthService';

describe('AuthService', () => {
  const user = { username: 'alice', name: 'Alice' };

  it('signUp retorna usuário', async () => {
    (global.fetch as any).mockResolvedValue(
      global.__createFetchResponse(user),
    );

    const res = await AuthService.signUp({} as any);
    expect(res).toEqual(user);
    expect((global.fetch as any).mock.calls[0][0]).toBe('/api/auth/signup');
  });

  it('signIn bem-sucedido retorna ok=true e url', async () => {
    const payload = { ok: true, url: '/feed' };
    (global.fetch as any).mockResolvedValue(
      global.__createFetchResponse(payload),
    );

    const res = await AuthService.signIn({} as any);
    expect(res).toEqual(payload);
  });

  it('signIn falha HTTP dispara exceção', async () => {
    (global.fetch as any).mockResolvedValue(
      global.__createFetchResponse({ error: 'Credenciais inválidas' }, { ok: false, status: 401 }),
    );

    await expect(AuthService.signIn({} as any)).rejects.toThrow('Credenciais inválidas');
  });

  it('signOut devolve ok=true', async () => {
    (global.fetch as any).mockResolvedValue(
      global.__createFetchResponse({ ok: true }),
    );

    const res = await AuthService.signOut();
    expect(res.ok).toBe(true);
  });

  it('getSession retorna null quando não logado', async () => {
    (global.fetch as any).mockResolvedValue(
      global.__createFetchResponse(null),
    );

    const session = await AuthService.getSession();
    expect(session).toBeNull();
  });
});
