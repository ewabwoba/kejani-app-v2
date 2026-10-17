import posthog from 'posthog-js';

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST as string | undefined;

let initialized = false;

export function initAnalytics(): void {
  if (initialized || !POSTHOG_KEY) return;
  posthog.init(POSTHOG_KEY, { api_host: POSTHOG_HOST ?? 'https://app.posthog.com' });
  initialized = true;
}

/**
 * Single entry point for every tracked interaction in the app.
 * Components never import posthog-js directly — this keeps event names
 * centrally discoverable and swappable if we change providers later.
 */
export function trackEvent(name: string, properties?: Record<string, unknown>): void {
  if (!initialized) return;
  posthog.capture(name, properties);
}
