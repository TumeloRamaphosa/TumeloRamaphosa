// Edge Function: request-ride
// ---------------------------------------------------------------------------
// Server-authoritative ride creation (Deno port of the FastAPI
// `create_new_ryde` endpoint). It computes the ETA from Google Distance Matrix
// server-side, then inserts the ride for the AUTHENTICATED caller — so the
// rider_id and ETA can't be spoofed by the client.
//
// Why server-side: the original endpoint hard-coded the API key and trusted a
// client-supplied user_id. Here the key is a secret and rider_id comes from the
// caller's JWT (RLS enforces it too).
//
// Deploy:
//   supabase functions deploy request-ride
//   supabase secrets set GOOGLE_MAPS_API_KEY=...
//
// POST body: {
//   service_level?: 'executive'|'first_class'|'sovereign',
//   origin: { latitude|lat, longitude|lng, label?, address? },
//   destination: { ... , label?, address? },
//   airport_code?: string, terminal?, airline?, flight_number?,
//   fare_zar?: number
// }
// ---------------------------------------------------------------------------

import { createClient } from 'jsr:@supabase/supabase-js@2';
import { handle, json, HttpError } from '../_shared/http.ts';
import { getRouteDetails, type LatLng } from '../_shared/googleMaps.ts';

interface PointInput {
  lat?: number;
  lng?: number;
  latitude?: number;
  longitude?: number;
  label?: string;
  address?: string;
}

function toLatLng(p: PointInput | undefined, name: string): LatLng {
  const lat = p?.lat ?? p?.latitude;
  const lng = p?.lng ?? p?.longitude;
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    throw new HttpError(400, `Invalid or missing ${name} coordinates`);
  }
  return { lat, lng };
}

function toPlace(p: PointInput, ll: LatLng) {
  return { label: p.label ?? 'Pin', address: p.address, lat: ll.lat, lng: ll.lng };
}

const SERVICE_LEVELS = ['executive', 'first_class', 'sovereign'] as const;
type ServiceLevel = (typeof SERVICE_LEVELS)[number];

Deno.serve(
  handle(async (req: Request) => {
    // Authenticate the caller via their JWT so rider_id is trustworthy and RLS
    // applies. (The app supplies its Supabase session token.)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new HttpError(401, 'Missing Authorization header');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) throw new HttpError(401, 'Not authenticated');

    const body = (await req.json().catch(() => ({}))) as {
      service_level?: string;
      origin?: PointInput;
      destination?: PointInput;
      airport_code?: string;
      terminal?: string;
      airline?: string;
      flight_number?: string;
      fare_zar?: number;
    };

    const originLL = toLatLng(body.origin, 'origin');
    const destLL = toLatLng(body.destination, 'destination');
    const serviceLevel: ServiceLevel = SERVICE_LEVELS.includes(
      body.service_level as ServiceLevel,
    )
      ? (body.service_level as ServiceLevel)
      : 'executive';

    // Real-time route details.
    const route = await getRouteDetails(
      originLL,
      destLL,
      Deno.env.get('GOOGLE_MAPS_API_KEY') ?? '',
    );
    const etaMinutes = Math.round(route.duration_seconds / 60);
    const distanceKm = Math.round((route.distance_meters / 1000) * 10) / 10;

    // Insert the ride; RLS requires rider_id == auth.uid().
    const { data, error } = await supabase
      .from('rides')
      .insert({
        rider_id: user.id,
        status: 'requested',
        service_level: serviceLevel,
        pickup: toPlace(body.origin!, originLL),
        destination: toPlace(body.destination!, destLL),
        airport_code: body.airport_code ?? 'JNB',
        terminal: body.terminal ?? null,
        airline: body.airline ?? null,
        flight_number: body.flight_number ?? null,
        distance_km: distanceKm,
        fare_zar: body.fare_zar ?? 0,
        eta_minutes: etaMinutes,
      })
      .select('*')
      .single();

    if (error) throw new HttpError(500, error.message);

    return json({
      ...data,
      eta_minutes: etaMinutes,
      distance_km: distanceKm,
      duration_in_traffic_text: route.duration_in_traffic_text,
      distance_text: route.distance_text,
    });
  }),
);
