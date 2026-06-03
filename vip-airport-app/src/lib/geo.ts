import type { LatLng } from '@/types';

const EARTH_RADIUS_KM = 6371;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Great-circle distance between two points, in kilometres. */
export function haversineKm(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Rough drive time. Real implementation should call the Google Routes API;
 * this gives a plausible estimate for quoting before a backend is wired up.
 * Assumes an average urban+freeway speed of ~38 km/h plus a fixed buffer.
 */
export function estimateDriveMinutes(distanceKm: number): number {
  const avgSpeedKmh = 38;
  return Math.max(5, Math.round((distanceKm / avgSpeedKmh) * 60) + 3);
}

/** Format a ZAR amount, e.g. 1450 -> "R 1 450". */
export function formatZar(amount: number): string {
  return `R ${Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}`;
}
