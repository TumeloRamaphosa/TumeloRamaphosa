import type { TrackWaypoint } from '@/types';

/**
 * OR Tambo International Airport (JNB) — VIP escort walking track.
 *
 * This is the sequence the airport VIP agent follows when escorting a
 * Sovereign-tier guest from the VIP arrivals curb at Terminal A
 * (International Departures) through to the aircraft. Each waypoint carries
 * a Street View camera framing so the guest can preview the exact route in
 * the app before they travel.
 *
 * Coordinates are approximate, hand-placed around the OR Tambo international
 * departures complex (~ -26.133, 28.242). Google's outdoor Street View and
 * indoor "Business View" panoramas cover much of the terminal frontage and
 * concourses; where indoor imagery is unavailable the embed falls back to
 * the nearest available pano. Refine these against on-site GPS for
 * production.
 */
export const OR_TAMBO_AIRPORT = {
  code: 'JNB',
  name: 'OR Tambo International Airport',
  city: 'Johannesburg',
  center: { lat: 26.133 * -1, lng: 28.242 },
} as const;

export const OR_TAMBO_TRACK: TrackWaypoint[] = [
  {
    index: 0,
    step: 'met_at_curb',
    title: 'VIP Arrivals — Terminal A curb',
    description:
      'Your chauffeur pulls into the dedicated VIP set-down. Your Aviar airport agent meets you at the vehicle door with your name board.',
    location: { lat: -26.13285, lng: 28.24163 },
    heading: 40,
    pitch: 0,
    fov: 90,
    walk_minutes: 2,
  },
  {
    index: 1,
    step: 'baggage_assist',
    title: 'Porter & baggage',
    description:
      'A porter takes your luggage. No queueing at the public check-in hall — your bags are handled through the premium counter.',
    location: { lat: -26.13312, lng: 28.2422 },
    heading: 110,
    pitch: 0,
    fov: 85,
    walk_minutes: 3,
  },
  {
    index: 2,
    step: 'fast_track_security',
    title: 'Fast-track security & passport control',
    description:
      'Skip the main lines. You clear security and immigration through the priority channel with your agent alongside.',
    location: { lat: -26.13365, lng: 28.24288 },
    heading: 160,
    pitch: 0,
    fov: 80,
    walk_minutes: 4,
  },
  {
    index: 3,
    step: 'lounge',
    title: 'Premier Lounge',
    description:
      'Relax in the private lounge until boarding. Your agent monitors your flight and collects you at the right moment.',
    location: { lat: -26.13402, lng: 28.24355 },
    heading: 210,
    pitch: 0,
    fov: 85,
    walk_minutes: 6,
  },
  {
    index: 4,
    step: 'boarding_walk',
    title: 'Concourse walk to the gate',
    description:
      'A calm, guided walk down the international concourse to your gate — this is the stretch you can preview street-by-street below.',
    location: { lat: -26.1346, lng: 28.2444 },
    heading: 250,
    pitch: 0,
    fov: 90,
    walk_minutes: 5,
  },
  {
    index: 5,
    step: 'at_aircraft',
    title: 'Apron transfer to the aircraft',
    description:
      'Sovereign tier: an escorted apron transfer takes you from the gate directly to the aircraft stairs. Handover complete.',
    location: { lat: -26.13539, lng: 28.24558 },
    heading: 300,
    pitch: -2,
    fov: 95,
    walk_minutes: 0,
  },
];
