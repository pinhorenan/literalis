// src/lib/fetcher.ts
export async function fetcher<JSON = any>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
  const res = await fetch(input, init);
  if (!res.ok) throw new Error('Erro ao buscar dados');
  return res.json();
}
