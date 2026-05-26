// Picks the active CloudProvider. Real Fly Sprites when SPRITES_TOKEN is set,
// otherwise the mock provider so the demo keeps working with zero config.
import { mockProvider, type CloudProvider } from "@/lib/cloud";
import { flyProvider, hasFlyCredentials } from "@/lib/providers/fly";

export function getProvider(): CloudProvider {
  return hasFlyCredentials() ? flyProvider : mockProvider;
}

export function activeProviderName(): "fly-sprites" | "mock" {
  return hasFlyCredentials() ? "fly-sprites" : "mock";
}
