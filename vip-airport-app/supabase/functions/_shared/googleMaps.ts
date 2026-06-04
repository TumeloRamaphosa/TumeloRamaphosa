// Google Distance Matrix client (Deno port of the original FastAPI
// GoogleMapsService). Server-side only — the API key never reaches the app.
//
// Hardening vs. the original:
//  - a request timeout via AbortController (no hung requests)
//  - falls back to `duration` when `duration_in_traffic` is absent (Google
//    omits it for some routes), so a valid route never 500s
//  - typed, with HttpError carrying the right status code

import { HttpError } from './http.ts';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface RouteDetails {
  distance_text: string;
  distance_meters: number;
  duration_in_traffic_text: string;
  duration_seconds: number;
  /** True when traffic-aware duration was available; false if we fell back. */
  traffic_aware: boolean;
}

const BASE_URL = 'https://maps.googleapis.com/maps/api/distancematrix/json';

interface DMElement {
  status: string;
  distance?: { text: string; value: number };
  duration?: { text: string; value: number };
  duration_in_traffic?: { text: string; value: number };
}

interface DMResponse {
  status: string;
  error_message?: string;
  rows?: { elements?: DMElement[] }[];
}

/**
 * Fetch real-time ETA + distance between two points for the ride/convoy.
 * @throws HttpError with an appropriate status on any failure.
 */
export async function getRouteDetails(
  origin: LatLng,
  dest: LatLng,
  apiKey: string,
  timeoutMs = 8000,
): Promise<RouteDetails> {
  if (!apiKey) {
    throw new HttpError(500, 'GOOGLE_MAPS_API_KEY is not configured');
  }

  const params = new URLSearchParams({
    origins: `${origin.lat},${origin.lng}`,
    destinations: `${dest.lat},${dest.lng}`,
    mode: 'driving',
    traffic_model: 'best_guess',
    departure_time: 'now',
    key: apiKey,
  });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}?${params.toString()}`, {
      signal: controller.signal,
    });
  } catch (cause) {
    throw new HttpError(504, 'Timed out contacting Google Maps');
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    throw new HttpError(502, 'Failed to communicate with Google Maps API');
  }

  const data = (await res.json()) as DMResponse;
  if (data.status !== 'OK') {
    throw new HttpError(400, `Google API error: ${data.status}`);
  }

  const element = data.rows?.[0]?.elements?.[0];
  if (!element) {
    throw new HttpError(502, 'Unexpected payload structure from Google Maps');
  }
  if (element.status !== 'OK') {
    throw new HttpError(404, 'Route not found between locations');
  }
  if (!element.distance) {
    throw new HttpError(502, 'Google Maps returned no distance');
  }

  // duration_in_traffic is preferred but not always present — fall back.
  const duration = element.duration_in_traffic ?? element.duration;
  if (!duration) {
    throw new HttpError(502, 'Google Maps returned no duration');
  }

  return {
    distance_text: element.distance.text,
    distance_meters: element.distance.value,
    duration_in_traffic_text: duration.text,
    duration_seconds: duration.value,
    traffic_aware: Boolean(element.duration_in_traffic),
  };
}
