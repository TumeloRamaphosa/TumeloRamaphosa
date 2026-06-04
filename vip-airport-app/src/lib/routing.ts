import { supabase } from './supabase';
import { hasBackend } from './env';
import { haversineKm, estimateDriveMinutes } from './geo';
import type { Place } from '@/types';

/**
 * Live route ETA + distance. When a backend is configured we call the
 * `route-eta` Edge Function (Google Distance Matrix, traffic-aware); otherwise
 * — or on any failure — we fall back to a local great-circle estimate so the
 * quote never blocks or dead-ends.
 */
export interface RouteEta {
  distanceKm: number;
  etaMinutes: number;
  /** Human label like "34 mins" when live; undefined for the local estimate. */
  durationText?: string;
  /** True when the numbers came from Google (traffic-aware). */
  live: boolean;
}

interface RouteEtaResponse {
  distance_meters: number;
  duration_seconds: number;
  duration_in_traffic_text?: string;
}

function localEstimate(origin: Place, destination: Place): RouteEta {
  const km = Math.max(1, haversineKm(origin, destination));
  return {
    distanceKm: Math.round(km * 10) / 10,
    etaMinutes: estimateDriveMinutes(km),
    live: false,
  };
}

export async function getRouteEta(
  origin: Place,
  destination: Place,
): Promise<RouteEta> {
  if (hasBackend) {
    try {
      const { data, error } = await supabase.functions.invoke<RouteEtaResponse>(
        'route-eta',
        { body: { origin, destination } },
      );
      if (!error && data) {
        return {
          distanceKm: Math.round((data.distance_meters / 1000) * 10) / 10,
          etaMinutes: Math.round(data.duration_seconds / 60),
          durationText: data.duration_in_traffic_text,
          live: true,
        };
      }
    } catch {
      // fall through to local estimate
    }
  }
  return localEstimate(origin, destination);
}
