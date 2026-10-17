/**
 * Same shape as the web project's httpClient so repository implementations
 * are near-identical across both apps. On Expo, env values come from
 * EXPO_PUBLIC_*-prefixed vars in .env — Metro inlines these at build time,
 * no native module or config plugin required. See .env.example.
 */

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
  throw new Error('EXPO_PUBLIC_API_BASE_URL is not set. Copy .env.example to .env and restart Metro.');
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
