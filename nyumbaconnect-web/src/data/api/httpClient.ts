/**
 * Thin fetch wrapper for the Spring Boot backend.
 * Base URL and any keys come from Vite env vars — nothing hardcoded here.
 * See .env.example at project root for the required variables.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

if (!BASE_URL) {
  // Fail loudly at boot rather than silently hitting `undefined/...`
  throw new Error('VITE_API_BASE_URL is not set. Copy .env.example to .env.local');
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  authToken?: string;
}

export async function httpClient<TResponse>(
  path: string,
  options: RequestOptions = {},
): Promise<TResponse> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.authToken ? { Authorization: `Bearer ${options.authToken}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => '');
    throw new Error(`API ${options.method ?? 'GET'} ${path} failed (${res.status}): ${errorBody}`);
  }

  return res.json() as Promise<TResponse>;
}
