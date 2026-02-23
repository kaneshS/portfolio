import { PostHog } from "posthog-node";

let posthogClient: PostHog | null = null;

export function getPostHogClient(): PostHog | null {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return null;
  }

  if (!posthogClient) {
    posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      flushAt: 1,
      flushInterval: 0,
    });
  }

  return posthogClient;
}

export async function trackEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, unknown>
) {
  const client = getPostHogClient();
  if (!client) return;

  client.capture({
    distinctId,
    event,
    properties,
  });

  await client.flush();
}

export async function shutdownPostHog() {
  if (posthogClient) {
    await posthogClient.shutdown();
    posthogClient = null;
  }
}
