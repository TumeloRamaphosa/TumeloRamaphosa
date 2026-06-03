import { env } from './env';
import type { TrackWaypoint } from '@/types';

/**
 * Build the HTML for a full-bleed Google Street View pano, suitable for
 * loading into a react-native-webview. We use the Maps Embed API
 * (streetview mode) so no extra JS SDK is required and it works inside a
 * plain WebView.
 *
 * Docs: https://developers.google.com/maps/documentation/embed/embedding-map
 */
export function streetViewHtml(wp: TrackWaypoint): string {
  const { lat, lng } = wp.location;
  const params = new URLSearchParams({
    key: env.googleMapsApiKey,
    location: `${lat},${lng}`,
    heading: String(wp.heading),
    pitch: String(wp.pitch),
    fov: String(wp.fov),
  });
  const src = `https://www.google.com/maps/embed/v1/streetview?${params.toString()}`;

  return `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <style>
      html, body { margin: 0; padding: 0; height: 100%; background: #0B0E1A; overflow: hidden; }
      iframe { border: 0; width: 100%; height: 100%; display: block; }
      .fallback {
        color: #9AA3BC; font-family: -apple-system, system-ui, sans-serif;
        display: flex; align-items: center; justify-content: center;
        height: 100%; text-align: center; padding: 24px; box-sizing: border-box;
      }
    </style>
  </head>
  <body>
    ${
      env.googleMapsApiKey
        ? `<iframe allowfullscreen loading="lazy" src="${src}"></iframe>`
        : `<div class="fallback">Add EXPO_PUBLIC_GOOGLE_MAPS_API_KEY to preview the OR Tambo walking track in Street View.</div>`
    }
  </body>
</html>`;
}
