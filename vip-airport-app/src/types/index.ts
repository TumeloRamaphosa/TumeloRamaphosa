/**
 * Domain types for Aviar VIP. These mirror the Supabase schema in
 * supabase/migrations/0001_init.sql.
 */

export type UserRole = 'rider' | 'driver' | 'vip_agent';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  vip_tier: VipTier;
  created_at: string;
}

export type VipTier = 'member' | 'gold' | 'platinum' | 'sovereign';

export interface DriverProfile {
  id: string; // == profiles.id
  vehicle_make: string;
  vehicle_model: string;
  vehicle_color: string;
  plate: string;
  rating: number;
  trips_completed: number;
  is_online: boolean;
  lat: number | null;
  lng: number | null;
}

/** Tiers of in-vehicle + airport service. Prices are indicative, in ZAR. */
export type ServiceLevel = 'executive' | 'first_class' | 'sovereign';

export interface ServiceLevelDef {
  id: ServiceLevel;
  name: string;
  tagline: string;
  vehicle: string;
  base_fare_zar: number;
  per_km_zar: number;
  airport_escort: boolean;
  fast_track_security: boolean;
  lounge_access: boolean;
  apron_transfer: boolean; // driven/escorted to the aircraft stairs
  seats: number;
}

export type RideStatus =
  | 'requested' // rider submitted, searching for chauffeur
  | 'accepted' // chauffeur assigned
  | 'arriving' // chauffeur en route to pickup
  | 'in_progress' // en route to airport
  | 'arrived_airport' // pulled into VIP arrivals
  | 'vip_handover' // handed to airport VIP agent
  | 'completed'
  | 'cancelled';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Place extends LatLng {
  label: string;
  address?: string;
}

export interface Ride {
  id: string;
  rider_id: string;
  driver_id: string | null;
  agent_id: string | null;
  status: RideStatus;
  service_level: ServiceLevel;
  pickup: Place;
  destination: Place; // an airport terminal
  airport_code: string; // e.g. "JNB"
  terminal: string | null; // e.g. "Terminal A — International Departures"
  airline: string | null;
  flight_number: string | null;
  scheduled_at: string | null; // ISO; null => now
  distance_km: number;
  fare_zar: number;
  eta_minutes: number;
  payment_id: string | null;
  created_at: string;
}

export type HandoverStep =
  | 'pending'
  | 'met_at_curb'
  | 'baggage_assist'
  | 'fast_track_security'
  | 'lounge'
  | 'boarding_walk'
  | 'at_aircraft'
  | 'complete';

export interface VipHandover {
  id: string;
  ride_id: string;
  agent_id: string | null;
  agent_name: string | null;
  step: HandoverStep;
  waypoint_index: number; // index into the OR Tambo walking track
  notes: string | null;
  updated_at: string;
}

export type PaymentStatus =
  | 'pending'
  | 'authorized'
  | 'paid'
  | 'failed'
  | 'refunded';

export interface Payment {
  id: string;
  ride_id: string;
  amount_zar: number;
  currency: 'ZAR';
  provider: 'stitch';
  status: PaymentStatus;
  stitch_payment_id: string | null;
  checkout_url: string | null;
  created_at: string;
}

/** A single stop on the OR Tambo VIP escort walking track. */
export interface TrackWaypoint {
  index: number;
  step: HandoverStep;
  title: string;
  description: string;
  location: LatLng;
  /** Street View camera framing. */
  heading: number;
  pitch: number;
  fov: number;
  /** Approximate walking time to the NEXT waypoint, in minutes. */
  walk_minutes: number;
}
