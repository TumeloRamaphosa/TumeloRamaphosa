import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { AppText, Badge, Button, Card, Divider, Row } from '@/components/ui';
import { MapPreview } from '@/components/MapPreview';
import { useApp } from '@/context/AppContext';
import { palette, radius, spacing } from '@/constants/theme';
import { formatZar } from '@/lib/geo';
import { getServiceLevel } from '@/constants/serviceLevels';
import type { RideStatus } from '@/types';

const STATUS_COPY: Record<RideStatus, { title: string; sub: string; tone: any }> = {
  requested: {
    title: 'Finding your chauffeur',
    sub: 'Matching you with a nearby VIP chauffeur…',
    tone: 'warning',
  },
  accepted: {
    title: 'Chauffeur assigned',
    sub: 'Your chauffeur is preparing the vehicle.',
    tone: 'info',
  },
  arriving: {
    title: 'Chauffeur arriving',
    sub: 'Your vehicle is on its way to the pickup point.',
    tone: 'info',
  },
  in_progress: {
    title: 'En route to OR Tambo',
    sub: 'Sit back. We are taking you to the airport.',
    tone: 'gold',
  },
  arrived_airport: {
    title: 'Arrived — VIP arrivals',
    sub: 'Your airport VIP agent is ready to meet you.',
    tone: 'gold',
  },
  vip_handover: {
    title: 'VIP hand-off in progress',
    sub: 'You are now with your airport agent.',
    tone: 'gold',
  },
  completed: { title: 'Journey complete', sub: 'Safe travels.', tone: 'success' },
  cancelled: { title: 'Ride cancelled', sub: '', tone: 'muted' },
};

export default function Trip() {
  const {
    ride,
    driverVehicle,
    confirmPickup,
    arriveAtAirport,
    beginHandover,
    cancelRide,
  } = useApp();
  const router = useRouter();

  // Once a hand-off begins, move the rider to the dedicated escort screen.
  useEffect(() => {
    if (ride?.status === 'vip_handover') {
      router.replace('/rider/handover');
    }
  }, [ride?.status, router]);

  if (!ride) return <Redirect href="/rider" />;

  const copy = STATUS_COPY[ride.status];
  const level = getServiceLevel(ride.service_level);
  const showDriver = driverVehicle && ride.status !== 'requested';

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between' }}>
        <AppText variant="h2">Your journey</AppText>
        <Badge label={ride.airport_code} tone="gold" />
      </Row>

      <MapPreview
        pickup={ride.pickup}
        destination={ride.destination}
        driver={
          driverVehicle && driverVehicle.lat != null && driverVehicle.lng != null
            ? { lat: driverVehicle.lat, lng: driverVehicle.lng, label: 'Chauffeur' }
            : null
        }
        height={220}
      />

      <Card style={{ gap: spacing.xs }}>
        <Badge label={copy.title.toUpperCase()} tone={copy.tone} />
        <AppText variant="h1" style={{ marginTop: spacing.sm }}>
          {copy.title}
        </AppText>
        <AppText variant="body" color={palette.textMuted}>
          {copy.sub}
        </AppText>
      </Card>

      {showDriver ? (
        <Card>
          <AppText variant="label" color={palette.textMuted}>
            YOUR CHAUFFEUR
          </AppText>
          <Row style={{ justifyContent: 'space-between', marginTop: spacing.sm }}>
            <View>
              <AppText variant="h3">
                {driverVehicle.vehicle_make} {driverVehicle.vehicle_model}
              </AppText>
              <AppText variant="caption" color={palette.textMuted}>
                {driverVehicle.vehicle_color} · {driverVehicle.plate}
              </AppText>
            </View>
            <Badge label={`★ ${driverVehicle.rating.toFixed(2)}`} tone="gold" />
          </Row>
        </Card>
      ) : null}

      <Card style={{ gap: spacing.sm }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <AppText color={palette.textMuted}>Service</AppText>
          <AppText>{level.name}</AppText>
        </Row>
        <Row style={{ justifyContent: 'space-between' }}>
          <AppText color={palette.textMuted}>Distance · ETA</AppText>
          <AppText>
            {ride.distance_km} km · ~{ride.eta_minutes} min
          </AppText>
        </Row>
        {ride.flight_number ? (
          <Row style={{ justifyContent: 'space-between' }}>
            <AppText color={palette.textMuted}>Flight</AppText>
            <AppText>
              {ride.airline ? `${ride.airline} ` : ''}
              {ride.flight_number}
            </AppText>
          </Row>
        ) : null}
        <Divider />
        <Row style={{ justifyContent: 'space-between' }}>
          <AppText variant="h3">Fare (paid)</AppText>
          <AppText variant="h3" color={palette.gold}>
            {formatZar(ride.fare_zar)}
          </AppText>
        </Row>
      </Card>

      <StepAction
        status={ride.status}
        onConfirmPickup={confirmPickup}
        onArrive={arriveAtAirport}
        onBeginHandover={() => {
          beginHandover();
          router.replace('/rider/handover');
        }}
      />

      {ride.status === 'requested' ||
      ride.status === 'accepted' ||
      ride.status === 'arriving' ? (
        <Button title="Cancel ride" variant="ghost" onPress={cancelRide} />
      ) : null}
      <View style={{ height: spacing.lg }} />
    </Screen>
  );
}

/**
 * Contextual primary action. In a live system these transitions are driven
 * by the chauffeur app + GPS geofencing; in the foundation they are exposed
 * here so a rider can play the journey forward on a single device.
 */
function StepAction({
  status,
  onConfirmPickup,
  onArrive,
  onBeginHandover,
}: {
  status: RideStatus;
  onConfirmPickup: () => void;
  onArrive: () => void;
  onBeginHandover: () => void;
}) {
  if (status === 'arriving' || status === 'accepted') {
    return <Button title="I'm in the vehicle" onPress={onConfirmPickup} />;
  }
  if (status === 'in_progress') {
    return <Button title="We've arrived at OR Tambo" onPress={onArrive} />;
  }
  if (status === 'arrived_airport') {
    return <Button title="Meet my VIP airport agent" onPress={onBeginHandover} />;
  }
  return (
    <View style={styles.hint}>
      <AppText variant="caption" color={palette.textFaint}>
        {status === 'requested'
          ? 'Hold tight — dispatching your chauffeur.'
          : ''}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  hint: {
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
});
