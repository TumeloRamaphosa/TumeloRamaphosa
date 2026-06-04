import { supabase } from './supabase';
import { hasBackend } from './env';
import { haversineKm, estimateDriveMinutes } from './geo';
import { getServiceLevel, estimateFare } from '@/constants/serviceLevels';
import type { Place, Ride, ServiceLevel } from '@/types';

/**
 * Ride persistence. Uses Supabase when configured; otherwise returns
 * locally-constructed rides so the app stays fully functional in demo mode.
 * The realtime/simulation lifecycle still lives in AppContext — this module
 * is the durable read/write layer (create + history).
 */

export interface CreateRideInput {
  riderId: string;
  pickup: Place;
  destination: Place;
  serviceLevel: ServiceLevel;
  airportCode: string;
  terminal?: string | null;
  airline?: string | null;
  flightNumber?: string | null;
  scheduledAt?: string | null;
}

function buildRide(input: CreateRideInput): Ride {
  const distanceKm = Math.max(1, haversineKm(input.pickup, input.destination));
  const level = getServiceLevel(input.serviceLevel);
  return {
    id: `ride_${Math.random().toString(36).slice(2, 10)}`,
    rider_id: input.riderId,
    driver_id: null,
    agent_id: null,
    status: 'requested',
    service_level: input.serviceLevel,
    pickup: input.pickup,
    destination: input.destination,
    airport_code: input.airportCode,
    terminal: input.terminal ?? null,
    airline: input.airline ?? null,
    flight_number: input.flightNumber ?? null,
    scheduled_at: input.scheduledAt ?? null,
    distance_km: Math.round(distanceKm * 10) / 10,
    fare_zar: estimateFare(level, distanceKm),
    eta_minutes: estimateDriveMinutes(distanceKm),
    payment_id: null,
    created_at: new Date().toISOString(),
  };
}

/** Persist a ride. Returns the created Ride (with server id when online). */
export async function createRide(input: CreateRideInput): Promise<Ride> {
  const ride = buildRide(input);
  if (!hasBackend) return ride;

  const { data, error } = await supabase
    .from('rides')
    .insert({
      rider_id: ride.rider_id,
      status: ride.status,
      service_level: ride.service_level,
      pickup: ride.pickup,
      destination: ride.destination,
      airport_code: ride.airport_code,
      terminal: ride.terminal,
      airline: ride.airline,
      flight_number: ride.flight_number,
      scheduled_at: ride.scheduled_at,
      distance_km: ride.distance_km,
      fare_zar: ride.fare_zar,
      eta_minutes: ride.eta_minutes,
    })
    .select('id')
    .single();

  if (error) throw error;
  return { ...ride, id: data.id as string };
}

/** List a rider's past rides, newest first. Empty array in demo mode. */
export async function listRides(riderId: string): Promise<Ride[]> {
  if (!hasBackend) return [];
  const { data, error } = await supabase
    .from('rides')
    .select('*')
    .eq('rider_id', riderId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Ride[];
}
