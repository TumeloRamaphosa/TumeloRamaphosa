// Edge Function: route-eta
// ---------------------------------------------------------------------------
// Live ETA + distance between two points via Google Distance Matrix. Replaces
// the app's local estimate with real, traffic-aware numbers. Server-side so the
// Google key stays secret.
//
// Deploy:
//   supabase functions deploy route-eta
//   supabase secrets set GOOGLE_MAPS_API_KEY=...
//
// POST body: { origin: {lat,lng}|{latitude,longitude}, destination: {...} }
// ---------------------------------------------------------------------------

import { handle, json, HttpError } from '../_shared/http.ts';
import { getRouteDetails, type LatLng } from '../_shared/googleMaps.ts';

interface PointInput {
  lat?: number;
  lng?: number;
  latitude?: number;
  longitude?: number;
}

/** Accept both {lat,lng} and {latitude,longitude} shapes. */
function toLatLng(p: PointInput | undefined, name: string): LatLng {
  const lat = p?.lat ?? p?.latitude;
  const lng = p?.lng ?? p?.longitude;
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    throw new HttpError(400, `Invalid or missing ${name} coordinates`);
  }
  return { lat, lng };
}

Deno.serve(
  handle(async (req: Request) => {
    const body = (await req.json().catch(() => ({}))) as {
      origin?: PointInput;
      destination?: PointInput;
    };

    const origin = toLatLng(body.origin, 'origin');
    const destination = toLatLng(body.destination, 'destination');

    const details = await getRouteDetails(
      origin,
      destination,
      Deno.env.get('GOOGLE_MAPS_API_KEY') ?? '',
    );

    return json(details);
  }),
);
