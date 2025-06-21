// File: tests/HTTPClient.test.ts
import { httpClient } from '@/src/lib/services/HTTPClient';

describe('httpClient', () => {
  it('faz GET e monta query-string corretamente', async () => {
    (global.fetch as any).mockResolvedValue(
      global.__createFetchResponse({ ok: true }),
    );

    await httpClient.get('/api/test', {
      params: { foo: 'bar', n: 42, undef: undefined },
    });

    const [url, opts] = (global.fetch as any).mock.calls[0];
    expect(url).toBe('/api/test?foo=bar&n=42');
    expect(opts.method).toBe('GET');
  });

  it('faz POST com JSON, seta Content-Type e devolve dados', async () => {
    const payload = { hello: 'world' };
    (global.fetch as any).mockResolvedValue(
      global.__createFetchResponse(payload),
    );

    const data = await httpClient.post('/api/test', payload);

    const [, opts] = (global.fetch as any).mock.calls[0];
    expect(opts.method).toBe('POST');
    expect(opts.headers['Content-Type']).toBe('application/json');
    expect(opts.body).toBe(JSON.stringify(payload));
    expect(data).toEqual(payload);
  });

  it('lida com corpo não-JSON (texto puro)', async () => {
    (global.fetch as any).mockResolvedValue(
      global.__createFetchResponse('plain text', { raw: true }),
    );

    const res = await httpClient.get<string>('/api/raw');
    expect(res).toBe('plain text');
  });

  it('propaga erro HTTP com mensagem vinda do servidor', async () => {
    (global.fetch as any).mockResolvedValue(
      global.__createFetchResponse({ error: 'Invalid!' }, { ok: false, status: 400 }),
    );

    await expect(httpClient.get('/api/boom')).rejects.toThrow('Invalid!');
  });

  it('propaga erro HTTP sem corpo JSON usando statusText', async () => {
    (global.fetch as any).mockResolvedValue(
      global.__createFetchResponse('', {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        raw: true,
      }),
    );

    await expect(httpClient.get('/api/boom')).rejects.toThrow('Internal Server Error');
  });
});

describe('httpClient - métodos PUT, PATCH e DELETE', () => {
  it('faz PUT com JSON e devolve dados', async () => {
    const payload = { foo: 'bar' };
    (global.fetch as any).mockResolvedValue(
      global.__createFetchResponse({ success: true }),
    );
    const data = await httpClient.put('/api/update', payload);
    const [, opts] = (global.fetch as any).mock.calls[0];
    expect(opts.method).toBe('PUT');
    expect(opts.headers['Content-Type']).toBe('application/json');
    expect(opts.body).toBe(JSON.stringify(payload));
    expect(data).toEqual({ success: true });
  });

  it('faz PATCH com JSON e devolve dados', async () => {
    const payload = { patch: 'value' };
    (global.fetch as any).mockResolvedValue(
      global.__createFetchResponse({ updated: true }),
    );
    const data = await httpClient.patch('/api/modify', payload);
    const [, opts] = (global.fetch as any).mock.calls[0];
    expect(opts.method).toBe('PATCH');
    expect(opts.headers['Content-Type']).toBe('application/json');
    expect(opts.body).toBe(JSON.stringify(payload));
    expect(data).toEqual({ updated: true });
  });

  it('faz DELETE e devolve dados', async () => {
    (global.fetch as any).mockResolvedValue(
      global.__createFetchResponse({ deleted: true }),
    );
    const data = await httpClient.del('/api/remove');
    const [, opts] = (global.fetch as any).mock.calls[0];
    expect(opts.method).toBe('DELETE');
    expect(data).toEqual({ deleted: true });
  });
});

describe('httpClient - query-string', () => {
  it('faz GET sem params e sem "?" no URL', async () => {
    (global.fetch as any).mockResolvedValue(
      global.__createFetchResponse({ foo: 'bar' }),
    );
    await httpClient.get('/api/no-params');
    const [url] = (global.fetch as any).mock.calls[0];
    expect(url).toBe('/api/no-params');
  });

  it('faz GET combinando query-string já existente', async () => {
    (global.fetch as any).mockResolvedValue(
      global.__createFetchResponse({ ok: true }),
    );
    await httpClient.get('/api/existing?x=1', { params: { y: 2 } });
    const [url] = (global.fetch as any).mock.calls[0];
    expect(url).toBe('/api/existing?x=1&y=2');
  });
});

describe('httpClient – casos extra de query-string e body/raw', () => {
  it('inclui boolean false nos params query-string', async () => {
    (global.fetch as any).mockResolvedValue(
      global.__createFetchResponse({ ok: true }),
    );
    await httpClient.get('/api/test', { params: { active: false } });
    const [url] = (global.fetch as any).mock.calls[0];
    expect(url).toBe('/api/test?active=false');
  });

  it('resposta vazia retorna undefined', async () => {
    (global.fetch as any).mockResolvedValue(
      global.__createFetchResponse('', { ok: true, raw: true }),
    );
    const res = await httpClient.get<any>('/api/empty');
    expect(res).toBeUndefined();
  });

  it('faz POST com body raw sem Content-Type', async () => {
    const rawBody = 'raw payload';
    (global.fetch as any).mockResolvedValue(
      global.__createFetchResponse({ success: true }),
    );
    const data = await httpClient.post('/api/upload', undefined, { body: rawBody });
    const [, opts] = (global.fetch as any).mock.calls[0];
    expect(opts.method).toBe('POST');
    expect(opts.headers['Content-Type']).toBeUndefined();
    expect(opts.body).toBe(rawBody);
    expect(data).toEqual({ success: true });
  });
});

describe('httpClient – filtragem de null e qs vazia', () => {
  it('filtra null e, sem nada sobrando, não adiciona "?"', async () => {
    (global.fetch as any).mockResolvedValue(
      global.__createFetchResponse({ result: 123 }),
    );
    await httpClient.get('/api/only-null', { params: { foo: null as any } });
    const [url] = (global.fetch as any).mock.calls[0];
    expect(url).toBe('/api/only-null');
  });

  it('filtra null mas mantém outros params', async () => {
    (global.fetch as any).mockResolvedValue(
      global.__createFetchResponse({ ok: true }),
    );
    await httpClient.get('/api/mixed', { params: { a: null as any, b: 'x', c: 0 } });
    const [url] = (global.fetch as any).mock.calls[0];
    // "a" sai, "b" e "c" entram, em ordem de Object.entries
    expect(url).toBe('/api/mixed?b=x&c=0');
  });
});

