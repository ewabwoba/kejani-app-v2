import PostHog from 'posthog-react-native';

let client: PostHog | null = null;

export async function initAnalytics(): Promise<void> {
  const key = process.env.EXPO_PUBLIC_POSTHOG_KEY;
  if (client || !key) return;
  client = await PostHog.initAsync(key, {
    host: process.env.EXPO_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com',
  });
}

/** Every tracked interaction in the app goes through here — components
 *  never import posthog-react-native directly. */
export function trackEvent(name: string, properties?: Record<string, unknown>): void {
  client?.capture(name, properties);
}
