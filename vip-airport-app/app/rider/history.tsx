import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { AppText, Badge, Card, Divider, Row } from '@/components/ui';
import { palette, radius, spacing } from '@/constants/theme';
import { formatZar } from '@/lib/geo';

/* --------------------------------- Types ---------------------------------- */

type AirportCode = 'JNB' | 'CPT';
type ServiceLevel = 'Executive' | 'First Class' | 'Sovereign';
type TripStatus = 'completed' | 'cancelled';

type Trip = {
  id: string;
  date: string;
  pickupLabel: string;
  airportCode: AirportCode;
  airportName: string;
  serviceLevel: ServiceLevel;
  fareZar: number;
  status: TripStatus;
  driverName: string;
  rating: number;
};

/* --------------------------------- Seed data ------------------------------ */
// Demo data — a backend hook will replace this once trip history lands.

const TRIPS: Trip[] = [
  {
    id: 'trip_001',
    date: '28 May 2026',
    pickupLabel: 'Sandton City, Johannesburg',
    airportCode: 'JNB',
    airportName: 'OR Tambo International',
    serviceLevel: 'Sovereign',
    fareZar: 2450,
    status: 'completed',
    driverName: 'Sipho Khumalo',
    rating: 5.0,
  },
  {
    id: 'trip_002',
    date: '19 May 2026',
    pickupLabel: 'V&A Waterfront, Cape Town',
    airportCode: 'CPT',
    airportName: 'Cape Town International',
    serviceLevel: 'First Class',
    fareZar: 1780,
    status: 'completed',
    driverName: 'Lerato Dlamini',
    rating: 4.9,
  },
  {
    id: 'trip_003',
    date: '12 May 2026',
    pickupLabel: 'Houghton Estate, Johannesburg',
    airportCode: 'JNB',
    airportName: 'OR Tambo International',
    serviceLevel: 'Executive',
    fareZar: 1450,
    status: 'completed',
    driverName: 'Thabo Nkosi',
    rating: 4.8,
  },
  {
    id: 'trip_004',
    date: '03 May 2026',
    pickupLabel: 'Camps Bay, Cape Town',
    airportCode: 'CPT',
    airportName: 'Cape Town International',
    serviceLevel: 'First Class',
    fareZar: 1920,
    status: 'cancelled',
    driverName: 'Naledi Mokoena',
    rating: 0,
  },
  {
    id: 'trip_005',
    date: '21 Apr 2026',
    pickupLabel: 'Rosebank, Johannesburg',
    airportCode: 'JNB',
    airportName: 'OR Tambo International',
    serviceLevel: 'Executive',
    fareZar: 1380,
    status: 'completed',
    driverName: 'Mandla Zulu',
    rating: 4.7,
  },
  {
    id: 'trip_006',
    date: '09 Apr 2026',
    pickupLabel: 'Constantia, Cape Town',
    airportCode: 'CPT',
    airportName: 'Cape Town International',
    serviceLevel: 'Sovereign',
    fareZar: 2680,
    status: 'completed',
    driverName: 'Anele Booi',
    rating: 5.0,
  },
];

/* --------------------------------- Helpers -------------------------------- */

type Stat = { label: string; value: string };

function buildStats(trips: Trip[]): Stat[] {
  const completed = trips.filter((t) => t.status === 'completed');
  const totalSpent = completed.reduce((sum, t) => sum + t.fareZar, 0);
  const avgRating =
    completed.length > 0
      ? completed.reduce((sum, t) => sum + t.rating, 0) / completed.length
      : 0;

  return [
    { label: 'Trips', value: String(trips.length) },
    { label: 'Total spent', value: formatZar(totalSpent) },
    { label: 'Avg rating', value: `★ ${avgRating.toFixed(1)}` },
  ];
}

const STATUS_BADGE: Record<TripStatus, { label: string; tone: 'success' | 'muted' }> = {
  completed: { label: 'COMPLETED', tone: 'success' },
  cancelled: { label: 'CANCELLED', tone: 'muted' },
};

/* -------------------------------- Components ------------------------------ */

function StatCard({ stat }: { stat: Stat }) {
  return (
    <Card style={styles.statCard}>
      <AppText variant="h3" color={palette.gold}>
        {stat.value}
      </AppText>
      <AppText variant="caption" color={palette.textMuted}>
        {stat.label}
      </AppText>
    </Card>
  );
}

function TripCard({ trip, onPress }: { trip: Trip; onPress: () => void }) {
  const badge = STATUS_BADGE[trip.status];
  const isCompleted = trip.status === 'completed';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.tripPressable, pressed && styles.pressed]}
    >
      <Card style={styles.tripCard}>
        <Row style={styles.spaceBetween}>
          <AppText variant="caption" color={palette.textMuted}>
            {trip.date}
          </AppText>
          <Badge label={badge.label} tone={badge.tone} />
        </Row>

        <Row style={styles.route}>
          <AppText variant="h3" style={styles.routeText} numberOfLines={1}>
            {trip.pickupLabel}
          </AppText>
          <AppText variant="h3" color={palette.gold} style={styles.arrow}>
            →
          </AppText>
          <AppText variant="h3" style={styles.routeText} numberOfLines={1}>
            {trip.airportName}
          </AppText>
        </Row>

        <Divider style={styles.divider} />

        <Row style={styles.spaceBetween}>
          <Row style={styles.meta}>
            <Badge label={trip.serviceLevel} tone="gold" />
            <AppText variant="caption" color={palette.textMuted} numberOfLines={1}>
              {trip.driverName}
              {isCompleted ? `  ·  ★ ${trip.rating.toFixed(1)}` : ''}
            </AppText>
          </Row>
          <AppText variant="h3" color={palette.gold}>
            {formatZar(trip.fareZar)}
          </AppText>
        </Row>
      </Card>
    </Pressable>
  );
}

function EmptyState() {
  return (
    <Card style={styles.empty}>
      <AppText variant="h3">No trips yet</AppText>
      <AppText variant="body" color={palette.textMuted}>
        Your completed journeys will appear here once you have travelled with Aviar
        VIP.
      </AppText>
    </Card>
  );
}

/* ---------------------------------- Screen -------------------------------- */

export default function History() {
  const router = useRouter();
  const trips = TRIPS;
  const stats = buildStats(trips);
  const hasTrips = trips.length > 0;

  return (
    <Screen scroll padded>
      <View style={styles.header}>
        <AppText variant="h2">Your trips</AppText>
        <AppText variant="caption" color={palette.textMuted}>
          Every journey, end to end
        </AppText>
      </View>

      {hasTrips ? (
        <Row style={styles.statsRow}>
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </Row>
      ) : null}

      {hasTrips ? (
        <View style={styles.list}>
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onPress={() => router.push('/rider/trip')}
            />
          ))}
        </View>
      ) : (
        <EmptyState />
      )}

      <View style={styles.bottomSpace} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.xs,
  },
  statsRow: {
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  list: {
    gap: spacing.lg,
  },
  tripPressable: {
    borderRadius: radius.lg,
  },
  pressed: {
    opacity: 0.85,
  },
  tripCard: {
    gap: spacing.md,
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  route: {
    flexWrap: 'wrap',
  },
  routeText: {
    flexShrink: 1,
  },
  arrow: {
    marginHorizontal: spacing.sm,
  },
  divider: {
    marginVertical: spacing.xs,
  },
  meta: {
    flexShrink: 1,
    gap: spacing.sm,
    marginRight: spacing.md,
  },
  empty: {
    gap: spacing.sm,
  },
  bottomSpace: {
    height: spacing.xl,
  },
});
