// -----------------------------------------------------------------------------
// src/services/httpClient.ts
// -----------------------------------------------------------------------------

/**
 * Small wrapper around `fetch` that adds:
 *  • JSON serialization / deserialization
 *  • Automatic credentials (cookies) on same-origin requests
 *  • Query-string support via `params`
 *  • Typed responses
 *  • Consistent error handling with message from server or `statusText`
 *
 * This runs on both client and server (Next.js RSC) without modification.
 */
export interface RequestOptions extends Omit<RequestInit, 'body'> {
  /** Query-string parameters that will be appended to the URL. */
  params?: Record<string, string | number | boolean | undefined>;
  /** Object that will be `JSON.stringify`-ed and sent as the request body. */
  json?: unknown;
  /** Raw body (e.g. FormData) for non-JSON uploads. */
  body?: BodyInit | null;
}

async function request<T>(url: string, { params, json, headers, body, ...init }: RequestOptions = {}): Promise<T> {
  /* Build query-string ------------------------------------------------------------------------- */
  const qs =
    params &&
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&');
  const fullUrl = qs ? `${url}${url.includes('?') ? '&' : '?'}${qs}` : url;

  /* Perform request --------------------------------------------------------------------------- */
  const res = await fetch(fullUrl, {
    ...init,
    credentials: 'include',
    headers: {
      ...(json ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: json ? JSON.stringify(json) : body,
  });

  /* Attempt to parse body as JSON (may be empty) ---------------------------------------------- */
  let data: unknown = undefined;
  const text = await res.text();
  if (text.length) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text as unknown;
    }
  }

  /* Throw on HTTP error ----------------------------------------------------------------------- */
  if (!res.ok) {
    const message = (data as any)?.error ?? res.statusText ?? 'Request failed';
    throw new Error(message);
  }

  return data as T;
}

/** Convenience helpers mirroring the common HTTP verbs. */
export const httpClient = {
  get: <T>(url: string, opts?: Omit<RequestOptions, 'method' | 'json' | 'body'>) =>
    request<T>(url, { ...opts, method: 'GET' }),
  post: <T>(url: string, json?: unknown, opts?: Omit<RequestOptions, 'method' | 'json'>) =>
    request<T>(url, { ...opts, method: 'POST', json }),
  put: <T>(url: string, json?: unknown, opts?: Omit<RequestOptions, 'method' | 'json'>) =>
    request<T>(url, { ...opts, method: 'PUT', json }),
  patch: <T>(url: string, json?: unknown, opts?: Omit<RequestOptions, 'method' | 'json'>) =>
    request<T>(url, { ...opts, method: 'PATCH', json }),
  del: <T>(url: string, opts?: Omit<RequestOptions, 'method' | 'json' | 'body'>) =>
    request<T>(url, { ...opts, method: 'DELETE' }),
};