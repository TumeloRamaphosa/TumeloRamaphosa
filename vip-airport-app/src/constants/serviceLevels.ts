import type { ServiceLevelDef } from '@/types';

/**
 * The three Aviar tiers. Every tier includes door-to-door chauffeur; the
 * differentiator vs. a normal ride hail is the airport-side concierge:
 * curb hand-off, fast-track security, lounge, and (top tier) escort all
 * the way to the aircraft on the apron.
 */
export const SERVICE_LEVELS: ServiceLevelDef[] = [
  {
    id: 'executive',
    name: 'Executive',
    tagline: 'Premium sedan + curbside VIP hand-off',
    vehicle: 'Mercedes-Benz E-Class or similar',
    base_fare_zar: 350,
    per_km_zar: 18,
    airport_escort: true,
    fast_track_security: false,
    lounge_access: false,
    apron_transfer: false,
    seats: 3,
  },
  {
    id: 'first_class',
    name: 'First Class',
    tagline: 'Luxury SUV, fast-track security & lounge',
    vehicle: 'BMW X7 / Mercedes-Benz GLS',
    base_fare_zar: 650,
    per_km_zar: 26,
    airport_escort: true,
    fast_track_security: true,
    lounge_access: true,
    apron_transfer: false,
    seats: 5,
  },
  {
    id: 'sovereign',
    name: 'Sovereign',
    tagline: 'Door-to-aircraft. Escorted onto the apron.',
    vehicle: 'Mercedes-Maybach / Range Rover Autobiography',
    base_fare_zar: 1450,
    per_km_zar: 42,
    airport_escort: true,
    fast_track_security: true,
    lounge_access: true,
    apron_transfer: true,
    seats: 4,
  },
];

export function getServiceLevel(id: string): ServiceLevelDef {
  return SERVICE_LEVELS.find((s) => s.id === id) ?? SERVICE_LEVELS[0];
}

/** Indicative fare estimate for a distance, in ZAR. */
export function estimateFare(level: ServiceLevelDef, distanceKm: number): number {
  return Math.round(level.base_fare_zar + level.per_km_zar * distanceKm);
}
