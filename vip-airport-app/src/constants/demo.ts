import type { DriverProfile, Place, Profile } from '@/types';
import { OR_TAMBO_AIRPORT } from '@/data/orTamboTrack';

/**
 * Seed/demo data so the full journey is playable without a backend.
 * When Supabase env vars are present the app uses live data instead.
 */

export const DEMO_RIDER: Profile = {
  id: 'demo-rider',
  role: 'rider',
  full_name: 'Thandi M.',
  phone: '+27 82 000 0000',
  avatar_url: null,
  vip_tier: 'platinum',
  created_at: new Date().toISOString(),
};

export const DEMO_DRIVER: Profile = {
  id: 'demo-driver',
  role: 'driver',
  full_name: 'Sipho N.',
  phone: '+27 83 111 1111',
  avatar_url: null,
  vip_tier: 'member',
  created_at: new Date().toISOString(),
};

export const DEMO_AGENT: Profile = {
  id: 'demo-agent',
  role: 'vip_agent',
  full_name: 'Lerato (OR Tambo VIP)',
  phone: '+27 11 921 6262',
  avatar_url: null,
  vip_tier: 'member',
  created_at: new Date().toISOString(),
};

export const DEMO_DRIVER_VEHICLE: DriverProfile = {
  id: 'demo-driver',
  vehicle_make: 'Mercedes-Maybach',
  vehicle_model: 'S 580',
  vehicle_color: 'Obsidian Black',
  plate: 'JHB VIP GP',
  rating: 4.97,
  trips_completed: 1284,
  is_online: true,
  lat: -26.107,
  lng: 28.056,
};

/** A few well-known Johannesburg pickup points for quick selection. */
export const DEMO_PICKUPS: Place[] = [
  {
    label: 'Sandton — Michelangelo Towers',
    address: '135 West St, Sandton',
    lat: -26.1076,
    lng: 28.0567,
  },
  {
    label: 'Rosebank — The Marc',
    address: '129 Rivonia Rd, Rosebank',
    lat: -26.1438,
    lng: 28.0436,
  },
  {
    label: 'Houghton Estate residence',
    address: 'Houghton, Johannesburg',
    lat: -26.1667,
    lng: 28.0539,
  },
  {
    label: 'Fourways — Steyn City',
    address: 'Cedar Rd, Fourways',
    lat: -25.9847,
    lng: 28.0,
  },
];

export const OR_TAMBO_TERMINAL_A: Place = {
  label: 'OR Tambo — Terminal A (Intl Departures)',
  address: 'O.R. Tambo International, Kempton Park',
  lat: -26.13285,
  lng: 28.24163,
};

export { OR_TAMBO_AIRPORT };
