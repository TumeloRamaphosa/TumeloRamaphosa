/**
 * Centralised access to public (client-safe) environment variables.
 * Only EXPO_PUBLIC_* values are available in the app bundle.
 */

function required(name: string, value: string | undefined): string {
  if (!value) {
    // Surfaced loudly in dev; in prod these should always be set via EAS.
    console.warn(`[env] Missing ${name}. Set it in your .env file.`);
  }
  return value ?? '';
}

export const env = {
  supabaseUrl: required(
    'EXPO_PUBLIC_SUPABASE_URL',
    process.env.EXPO_PUBLIC_SUPABASE_URL,
  ),
  supabaseAnonKey: required(
    'EXPO_PUBLIC_SUPABASE_ANON_KEY',
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  ),
  googleMapsApiKey: required(
    'EXPO_PUBLIC_GOOGLE_MAPS_API_KEY',
    process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
  ),
};

/** True when Supabase credentials are present and the app can talk to a backend. */
export const hasBackend = Boolean(env.supabaseUrl && env.supabaseAnonKey);
