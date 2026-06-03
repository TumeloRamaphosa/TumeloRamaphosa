import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {
  HandoverStep,
  Payment,
  Place,
  Profile,
  Ride,
  ServiceLevel,
  UserRole,
  VipHandover,
} from '@/types';
import {
  DEMO_AGENT,
  DEMO_DRIVER,
  DEMO_DRIVER_VEHICLE,
  DEMO_RIDER,
} from '@/constants/demo';
import { getServiceLevel, estimateFare } from '@/constants/serviceLevels';
import { haversineKm, estimateDriveMinutes } from '@/lib/geo';
import { OR_TAMBO_TRACK } from '@/data/orTamboTrack';

/**
 * Single source of truth for the demo/runtime app state. In demo mode
 * (no Supabase configured) the ride lifecycle is simulated locally so the
 * entire journey — booking, chauffeur match, trip, and OR Tambo VIP
 * hand-off — is playable end to end. The same shape maps cleanly onto
 * Supabase tables + realtime when a backend is wired in.
 */

interface BookRideInput {
  pickup: Place;
  destination: Place;
  serviceLevel: ServiceLevel;
  flightNumber?: string;
  airline?: string;
  terminal?: string;
  scheduledAt?: string | null;
}

interface AppState {
  profile: Profile | null;
  role: UserRole | null;
  ride: Ride | null;
  handover: VipHandover | null;
  payment: Payment | null;
  driverVehicle: typeof DEMO_DRIVER_VEHICLE | null;

  signInAs: (role: UserRole) => void;
  signOut: () => void;

  quote: (pickup: Place, destination: Place, level: ServiceLevel) => {
    distanceKm: number;
    etaMinutes: number;
    fareZar: number;
  };
  bookRide: (input: BookRideInput) => Ride;
  markPaid: () => void;

  // Lifecycle transitions (driven by timers + driver/agent screens in demo)
  confirmPickup: () => void;
  arriveAtAirport: () => void;
  beginHandover: () => void;
  setHandoverStep: (step: HandoverStep, waypointIndex: number) => void;
  completeRide: () => void;
  cancelRide: () => void;
}

const AppContext = createContext<AppState | null>(null);

function genId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

const PROFILES: Record<UserRole, Profile> = {
  rider: DEMO_RIDER,
  driver: DEMO_DRIVER,
  vip_agent: DEMO_AGENT,
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ride, setRide] = useState<Ride | null>(null);
  const [handover, setHandover] = useState<VipHandover | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [driverVehicle, setDriverVehicle] = useState<
    typeof DEMO_DRIVER_VEHICLE | null
  >(null);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const signInAs = useCallback((role: UserRole) => {
    setProfile(PROFILES[role]);
  }, []);

  const signOut = useCallback(() => {
    clearTimers();
    setProfile(null);
    setRide(null);
    setHandover(null);
    setPayment(null);
    setDriverVehicle(null);
  }, [clearTimers]);

  const quote = useCallback(
    (pickup: Place, destination: Place, level: ServiceLevel) => {
      const distanceKm = Math.max(1, haversineKm(pickup, destination));
      const def = getServiceLevel(level);
      return {
        distanceKm: Math.round(distanceKm * 10) / 10,
        etaMinutes: estimateDriveMinutes(distanceKm),
        fareZar: estimateFare(def, distanceKm),
      };
    },
    [],
  );

  const bookRide = useCallback(
    (input: BookRideInput): Ride => {
      clearTimers();
      const q = quote(input.pickup, input.destination, input.serviceLevel);
      const newRide: Ride = {
        id: genId('ride'),
        rider_id: profile?.id ?? DEMO_RIDER.id,
        driver_id: null,
        agent_id: null,
        status: 'requested',
        service_level: input.serviceLevel,
        pickup: input.pickup,
        destination: input.destination,
        airport_code: 'JNB',
        terminal: input.terminal ?? 'Terminal A — International Departures',
        airline: input.airline ?? null,
        flight_number: input.flightNumber ?? null,
        scheduled_at: input.scheduledAt ?? null,
        distance_km: q.distanceKm,
        fare_zar: q.fareZar,
        eta_minutes: q.etaMinutes,
        payment_id: null,
        created_at: new Date().toISOString(),
      };
      setRide(newRide);
      setHandover(null);

      // Simulate matching a chauffeur, then en-route to pickup.
      timers.current.push(
        setTimeout(() => {
          setDriverVehicle(DEMO_DRIVER_VEHICLE);
          setRide((r) =>
            r ? { ...r, status: 'accepted', driver_id: DEMO_DRIVER.id } : r,
          );
        }, 3500),
      );
      timers.current.push(
        setTimeout(() => {
          setRide((r) => (r ? { ...r, status: 'arriving' } : r));
        }, 7000),
      );

      return newRide;
    },
    [clearTimers, profile?.id, quote],
  );

  const markPaid = useCallback(() => {
    setPayment((p) => {
      const base: Payment = p ?? {
        id: genId('pay'),
        ride_id: ride?.id ?? '',
        amount_zar: ride?.fare_zar ?? 0,
        currency: 'ZAR',
        provider: 'stitch',
        status: 'pending',
        stitch_payment_id: null,
        checkout_url: null,
        created_at: new Date().toISOString(),
      };
      return { ...base, status: 'paid' };
    });
    setRide((r) => (r ? { ...r, payment_id: r.payment_id ?? genId('pay') } : r));
  }, [ride?.fare_zar, ride?.id]);

  const confirmPickup = useCallback(() => {
    setRide((r) => (r ? { ...r, status: 'in_progress' } : r));
  }, []);

  const arriveAtAirport = useCallback(() => {
    setRide((r) => (r ? { ...r, status: 'arrived_airport' } : r));
  }, []);

  const beginHandover = useCallback(() => {
    setRide((r) => (r ? { ...r, status: 'vip_handover', agent_id: DEMO_AGENT.id } : r));
    setHandover({
      id: genId('handover'),
      ride_id: ride?.id ?? '',
      agent_id: DEMO_AGENT.id,
      agent_name: DEMO_AGENT.full_name,
      step: OR_TAMBO_TRACK[0].step,
      waypoint_index: 0,
      notes: null,
      updated_at: new Date().toISOString(),
    });
  }, [ride?.id]);

  const setHandoverStep = useCallback(
    (step: HandoverStep, waypointIndex: number) => {
      setHandover((h) =>
        h
          ? {
              ...h,
              step,
              waypoint_index: waypointIndex,
              updated_at: new Date().toISOString(),
            }
          : h,
      );
    },
    [],
  );

  const completeRide = useCallback(() => {
    clearTimers();
    setHandover((h) =>
      h ? { ...h, step: 'complete', waypoint_index: OR_TAMBO_TRACK.length - 1 } : h,
    );
    setRide((r) => (r ? { ...r, status: 'completed' } : r));
  }, [clearTimers]);

  const cancelRide = useCallback(() => {
    clearTimers();
    setRide((r) => (r ? { ...r, status: 'cancelled' } : r));
    setHandover(null);
  }, [clearTimers]);

  const value = useMemo<AppState>(
    () => ({
      profile,
      role: profile?.role ?? null,
      ride,
      handover,
      payment,
      driverVehicle,
      signInAs,
      signOut,
      quote,
      bookRide,
      markPaid,
      confirmPickup,
      arriveAtAirport,
      beginHandover,
      setHandoverStep,
      completeRide,
      cancelRide,
    }),
    [
      profile,
      ride,
      handover,
      payment,
      driverVehicle,
      signInAs,
      signOut,
      quote,
      bookRide,
      markPaid,
      confirmPickup,
      arriveAtAirport,
      beginHandover,
      setHandoverStep,
      completeRide,
      cancelRide,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
