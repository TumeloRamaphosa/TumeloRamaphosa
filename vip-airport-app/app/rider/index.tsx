import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Brand } from '@/components/Brand';
import { AppText, Badge, Button, Card, Divider, Row } from '@/components/ui';
import { MapPreview } from '@/components/MapPreview';
import { ServiceLevelPicker } from '@/components/ServiceLevelPicker';
import { PlacesAutocomplete } from '@/components/PlacesAutocomplete';
import { useApp } from '@/context/AppContext';
import { useDeviceLocation } from '@/hooks/useDeviceLocation';
import { palette, radius, spacing } from '@/constants/theme';
import { DEMO_PICKUPS, OR_TAMBO_TERMINAL_A } from '@/constants/demo';
import { formatZar } from '@/lib/geo';
import { getServiceLevel, estimateFare } from '@/constants/serviceLevels';
import { hasBackend } from '@/lib/env';
import { createRidePayment, openCheckout } from '@/lib/payments';
import { getRouteEta, type RouteEta } from '@/lib/routing';
import type { Place, ServiceLevel } from '@/types';

export default function BookRide() {
  const { profile, quote, bookRide, markPaid } = useApp();
  const router = useRouter();
  const location = useDeviceLocation();

  const [pickup, setPickup] = useState<Place>(DEMO_PICKUPS[0]);
  const [serviceLevel, setServiceLevel] = useState<ServiceLevel>('first_class');
  const [airline, setAirline] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [route, setRoute] = useState<RouteEta | null>(null);

  async function onUseMyLocation() {
    const place = await location.request();
    if (place) setPickup(place);
    else if (location.error) Alert.alert('Location', location.error);
  }

  const destination = OR_TAMBO_TERMINAL_A;
  const q = useMemo(
    () => quote(pickup, destination, serviceLevel),
    [pickup, destination, serviceLevel, quote],
  );

  // Fetch a live, traffic-aware ETA/distance for the chosen pickup. Falls back
  // to the local estimate inside getRouteEta; we ignore stale responses.
  useEffect(() => {
    let active = true;
    setRoute(null);
    getRouteEta(pickup, destination).then((r) => {
      if (active) setRoute(r);
    });
    return () => {
      active = false;
    };
  }, [pickup, destination]);

  // Prefer live route numbers when present; fare tracks the live distance.
  const distanceKm = route?.distanceKm ?? q.distanceKm;
  const etaMinutes = route?.etaMinutes ?? q.etaMinutes;
  const fareZar = estimateFare(getServiceLevel(serviceLevel), distanceKm);
  const etaLabel = route?.live
    ? `${route.durationText ?? `~${etaMinutes} min`} in traffic`
    : `~${etaMinutes} min`;

  async function onRequest() {
    setSubmitting(true);
    try {
      const ride = bookRide({
        pickup,
        destination,
        serviceLevel,
        airline: airline.trim() || undefined,
        flightNumber: flightNumber.trim() || undefined,
        terminal: 'Terminal A — International Departures',
      });

      if (hasBackend) {
        // Production path: create a Stitch payment and open hosted checkout.
        const { payment_id, checkout_url } = await createRidePayment(
          ride.id,
          ride.fare_zar,
        );
        const outcome = await openCheckout(checkout_url, payment_id);
        if (outcome !== 'paid') {
          Alert.alert('Payment not completed', 'Your chauffeur was not dispatched.');
          setSubmitting(false);
          return;
        }
      }
      // Demo path (or confirmed payment): mark paid and continue.
      markPaid();
      router.push('/rider/trip');
    } catch (e: any) {
      Alert.alert('Something went wrong', e?.message ?? 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between' }}>
        <Brand />
        <Row style={{ gap: spacing.lg }}>
          <Pressable onPress={() => router.push('/rider/history')}>
            <AppText variant="caption" color={palette.textMuted}>
              Trips
            </AppText>
          </Pressable>
          <Pressable onPress={() => router.push('/rider/profile')}>
            <AppText variant="caption" color={palette.textMuted}>
              Profile
            </AppText>
          </Pressable>
        </Row>
      </Row>

      <AppText variant="display">
        Hello, {profile?.full_name?.split(' ')[0] ?? 'guest'}.
      </AppText>
      <AppText variant="body" color={palette.textMuted}>
        Where shall we collect you for OR Tambo?
      </AppText>

      <MapPreview pickup={pickup} destination={destination} height={200} />

      {/* Pickup selection */}
      <Card>
        <Row style={{ justifyContent: 'space-between', marginBottom: spacing.xs }}>
          <AppText variant="label" color={palette.textMuted}>
            PICKUP
          </AppText>
          <Pressable onPress={onUseMyLocation}>
            <AppText variant="caption" color={palette.gold}>
              {location.loading ? 'Locating…' : '◎ Use my location'}
            </AppText>
          </Pressable>
        </Row>
        <PlacesAutocomplete
          placeholder="Search any address…"
          value={pickup}
          onSelect={setPickup}
        />
        <View style={styles.chipWrap}>
          {DEMO_PICKUPS.map((p) => {
            const active = p.label === pickup.label;
            return (
              <Pressable
                key={p.label}
                onPress={() => setPickup(p)}
                style={[
                  styles.chip,
                  {
                    borderColor: active ? palette.gold : palette.border,
                    backgroundColor: active ? palette.goldMuted : 'transparent',
                  },
                ]}
              >
                <AppText
                  variant="caption"
                  color={active ? palette.gold : palette.textMuted}
                >
                  {p.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>
        <Divider />
        <Row style={{ justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <AppText variant="label" color={palette.textMuted}>
              DESTINATION
            </AppText>
            <AppText variant="h3">{destination.label}</AppText>
          </View>
          <Badge label="JNB" tone="gold" />
        </Row>
      </Card>

      {/* Flight details */}
      <Card>
        <AppText variant="label" color={palette.textMuted}>
          FLIGHT DETAILS (OPTIONAL)
        </AppText>
        <Row style={{ gap: spacing.md, marginTop: spacing.sm }}>
          <TextInput
            placeholder="Airline"
            placeholderTextColor={palette.textFaint}
            value={airline}
            onChangeText={setAirline}
            style={[styles.input, { flex: 1.4 }]}
          />
          <TextInput
            placeholder="Flight no."
            placeholderTextColor={palette.textFaint}
            autoCapitalize="characters"
            value={flightNumber}
            onChangeText={setFlightNumber}
            style={[styles.input, { flex: 1 }]}
          />
        </Row>
        <AppText variant="caption" color={palette.textFaint} style={{ marginTop: spacing.sm }}>
          We track your flight so your chauffeur and airport agent adapt to delays.
        </AppText>
      </Card>

      {/* Service level */}
      <AppText variant="label" color={palette.textMuted}>
        CHOOSE YOUR SERVICE — {distanceKm} km · {etaLabel}
      </AppText>
      <ServiceLevelPicker
        selected={serviceLevel}
        onSelect={setServiceLevel}
        distanceKm={distanceKm}
      />

      <Card style={{ gap: spacing.sm }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <AppText variant="h3">Total</AppText>
          <AppText variant="h2" color={palette.gold}>
            {formatZar(fareZar)}
          </AppText>
        </Row>
        <AppText variant="caption" color={palette.textFaint}>
          {route?.live ? 'Live traffic-aware fare · ' : ''}Paid securely via
          Stitch · cards & instant EFT · ZAR
        </AppText>
      </Card>

      <Button
        title={`Request VIP Chauffeur · ${formatZar(fareZar)}`}
        onPress={onRequest}
        loading={submitting}
      />
      <View style={{ height: spacing.xl }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  chip: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  input: {
    backgroundColor: palette.surfaceAlt,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    color: palette.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 15,
  },
});
