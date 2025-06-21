// File: tests/setupTests.ts

declare global {
  // eslint-disable-next-line no-var
  var __createFetchResponse: (
    body: unknown,
    options?: {
      ok?: boolean;
      status?: number;
      statusText?: string;
      raw?: boolean;
    },
  ) => {
    ok: boolean;
    status: number;
    statusText: string;
    text: () => Promise<string>;
  };
}

// Helper que cria objetos parecidos com Response
globalThis.__createFetchResponse = (
  body: unknown,
  {
    ok = true,
    status = ok ? 200 : 400,
    statusText,
    raw = false,
  }: { ok?: boolean; status?: number; statusText?: string; raw?: boolean } = {},
) => {
  const textValue =
    body === undefined
      ? ''
      : raw || typeof body === 'string'
      ? (body as string)
      : JSON.stringify(body);

  return {
    ok,
    status,
    statusText: statusText ?? (ok ? 'OK' : 'Bad Request'),
    text: jest.fn().mockResolvedValue(textValue), // Use jest.fn()
  };
};

// Reseta mocks antes de cada teste
beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

export {};
