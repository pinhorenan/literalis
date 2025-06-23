// src/lib/httpClient.ts
type RequestOptions = RequestInit & {
  headers?: Record<string, string>;
};

async function request<T = unknown>(
  method: string,
  url: string,
  data?: any,
  options: RequestOptions = {}
): Promise<Response> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const config: RequestInit = {
    method,
    headers,
    ...options,
  };

  if (data !== undefined) {
    config.body = JSON.stringify(data);
  }

  const res = await fetch(url, config);
  return res;
}

export const httpClient = {
  get: <T = unknown>(url: string, options?: RequestOptions) =>
    request<T>('GET', url, undefined, options),

  post: <T = unknown>(url: string, data: any, options?: RequestOptions) =>
    request<T>('POST', url, data, options),

  patch: <T = unknown>(url: string, data: any, options?: RequestOptions) =>
    request<T>('PATCH', url, data, options),

  put: <T = unknown>(url: string, data: any, options?: RequestOptions) =>
    request<T>('PUT', url, data, options),

  delete: <T = unknown>(url: string, options?: RequestOptions) =>
    request<T>('DELETE', url, undefined, options),
};
